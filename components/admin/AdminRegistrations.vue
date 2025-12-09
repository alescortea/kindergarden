<template>
  <div class="admin-registrations">
    <!-- Filters -->
    <div class="filters-section">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="8" :md="6">
          <a-select
            v-model:value="filters.activityType"
            placeholder="Filter by activity type"
            allow-clear
            @change="loadRegistrations"
          >
            <a-select-option value="">All Types</a-select-option>
            <a-select-option value="camp">Camp</a-select-option>
            <a-select-option value="hike">Hike</a-select-option>
            <a-select-option value="trip">Trip</a-select-option>
            <a-select-option value="ski">Ski</a-select-option>
            <a-select-option value="swimming">Swimming</a-select-option>
            <a-select-option value="afterschool">Afterschool</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8" :md="6">
          <a-select
            v-model:value="filters.status"
            placeholder="Filter by status"
            allow-clear
            @change="loadRegistrations"
          >
            <a-select-option value="">All Statuses</a-select-option>
            <a-select-option value="pending">Pending</a-select-option>
            <a-select-option value="confirmed">Confirmed</a-select-option>
            <a-select-option value="cancelled">Cancelled</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8" :md="6">
          <a-input
            v-model:value="filters.search"
            placeholder="Search by name..."
            @input="loadRegistrations"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-button type="primary" @click="exportToExcel">
            <DownloadOutlined />
            Export Excel
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- Table -->
    <div class="table-section">
      <a-spin :spinning="loading">
        <a-table
          :columns="columns"
          :data-source="filteredRegistrations"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} registrations`
          }"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'childName'">
              {{ record.child.firstName }} {{ record.child.lastName }}
            </template>
            <template v-if="column.key === 'parentName'">
              {{ record.parent.firstName }} {{ record.parent.lastName }}
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </a-tag>
            </template>
            <template v-if="column.key === 'actions'">
              <a-space>
                <a-button size="small" @click="viewRegistration(record)">
                  <EyeOutlined />
                </a-button>
                <a-button size="small" @click="editRegistration(record)">
                  <EditOutlined />
                </a-button>
                <a-popconfirm
                  title="Are you sure you want to delete this registration?"
                  @confirm="deleteRegistration(record.id)"
                >
                  <a-button size="small" danger>
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-spin>
    </div>

    <!-- View/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEditing ? 'Edit Registration' : 'View Registration'"
      :width="800"
      :footer="null"
    >
      <div v-if="selectedRegistration" class="registration-details">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="Child">
            {{ selectedRegistration.child.firstName }} {{ selectedRegistration.child.lastName }}
          </a-descriptions-item>
          <a-descriptions-item label="Age">
            {{ selectedRegistration.child.age }} years
          </a-descriptions-item>
          <a-descriptions-item label="Parent">
            {{ selectedRegistration.parent.firstName }} {{ selectedRegistration.parent.lastName }}
          </a-descriptions-item>
          <a-descriptions-item label="Phone">
            {{ selectedRegistration.parent.phone }}
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            {{ selectedRegistration.parent.email }}
          </a-descriptions-item>
          <a-descriptions-item label="Activity Type">
            {{ selectedRegistration.activityType }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-select
              v-model:value="selectedRegistration.status"
              @change="updateStatus"
            >
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="confirmed">Confirmed</a-select-option>
              <a-select-option value="cancelled">Cancelled</a-select-option>
            </a-select>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

const loading = ref(false)
const registrations = ref<any[]>([])
const filters = ref({
  activityType: '',
  status: '',
  search: ''
})
const modalVisible = ref(false)
const selectedRegistration = ref<any>(null)
const isEditing = ref(false)

const columns = [
  { title: 'Child', key: 'childName' },
  { title: 'Age', dataIndex: ['child', 'age'] },
  { title: 'Parent', key: 'parentName' },
  { title: 'Phone', dataIndex: ['parent', 'phone'] },
  { title: 'Activity Type', dataIndex: 'activityType' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', width: 120 }
]

const filteredRegistrations = computed(() => {
  let filtered = registrations.value

  if (filters.value.activityType) {
    filtered = filtered.filter(r => r.activityType === filters.value.activityType)
  }

  if (filters.value.status) {
    filtered = filtered.filter(r => r.status === filters.value.status)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(r =>
      r.child.firstName.toLowerCase().includes(search) ||
      r.child.lastName.toLowerCase().includes(search) ||
      r.parent.firstName.toLowerCase().includes(search) ||
      r.parent.lastName.toLowerCase().includes(search)
    )
  }

  return filtered
})

const loadRegistrations = async () => {
  loading.value = true
  try {
    const query: any = {}
    if (filters.value.activityType) query.activityType = filters.value.activityType
    if (filters.value.status) query.status = filters.value.status

    const response = await $fetch('/api/registrations', { query })
    registrations.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load registrations:', error)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'orange',
    'confirmed': 'green',
    'cancelled': 'red'
  }
  return colors[status] || 'default'
}

const viewRegistration = (registration: any) => {
  selectedRegistration.value = { ...registration }
  isEditing.value = false
  modalVisible.value = true
}

const editRegistration = (registration: any) => {
  selectedRegistration.value = { ...registration }
  isEditing.value = true
  modalVisible.value = true
}

const updateStatus = async () => {
  if (!selectedRegistration.value) return

  try {
    await $fetch(`/api/registrations/${selectedRegistration.value.id}`, {
      method: 'PATCH',
      body: { status: selectedRegistration.value.status }
    })
    await loadRegistrations()
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const deleteRegistration = async (id: string) => {
  try {
    await $fetch(`/api/registrations/${id}`, { method: 'DELETE' })
    await loadRegistrations()
  } catch (error) {
    console.error('Failed to delete registration:', error)
  }
}

const exportToExcel = () => {
  const data = filteredRegistrations.value.map(reg => ({
    'Child Name': `${reg.child.firstName} ${reg.child.lastName}`,
    'Age': reg.child.age,
    'Parent Name': `${reg.parent.firstName} ${reg.parent.lastName}`,
    'Phone': reg.parent.phone,
    'Email': reg.parent.email,
    'Activity Type': reg.activityType,
    'Status': reg.status
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Registrations')
  XLSX.writeFile(wb, `registrations_${dayjs().format('YYYY-MM-DD')}.xlsx`)
}

onMounted(() => {
  loadRegistrations()
})
</script>

<style scoped>
.admin-registrations {
  padding: 24px;
}

.filters-section {
  background: #fafafa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.table-section {
  background: white;
  border-radius: 12px;
}

.registration-details {
  max-height: 500px;
  overflow-y: auto;
}
</style>



