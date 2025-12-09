<template>
  <div class="admin-registrations">
    <!-- Filters -->
    <div class="filters-section">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="8" :md="6">
          <a-select
            v-model:value="filters.activityType"
            placeholder="Filtrează după tip activitate"
            allow-clear
            @change="loadRegistrations"
          >
            <a-select-option value="">Toate Tipurile</a-select-option>
            <a-select-option value="camp">Tabără</a-select-option>
            <a-select-option value="hike">Drumeție</a-select-option>
            <a-select-option value="trip">Excursie</a-select-option>
            <a-select-option value="ski">Ski</a-select-option>
            <a-select-option value="swimming">Înot</a-select-option>
            <a-select-option value="afterschool">După școală</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8" :md="6">
          <a-select
            v-model:value="filters.status"
            placeholder="Filtrează după status"
            allow-clear
            @change="loadRegistrations"
          >
            <a-select-option value="">Toate Statusurile</a-select-option>
            <a-select-option value="pending">În așteptare</a-select-option>
            <a-select-option value="confirmed">Confirmat</a-select-option>
            <a-select-option value="cancelled">Anulat</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8" :md="6">
          <a-input
            v-model:value="filters.search"
            placeholder="Caută după nume..."
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
            Exportă Excel
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- Desktop Table -->
    <div class="table-section desktop-table">
      <a-spin :spinning="loading">
        <div class="table-wrapper">
          <a-table
            :columns="columns"
            :data-source="filteredRegistrations"
            :pagination="{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} din ${total} înscrieri`
            }"
            :scroll="{ x: 'max-content' }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'childName'">
                {{ record.child.firstName }} {{ record.child.lastName }}
              </template>
              <template v-if="column.key === 'parentName'">
                {{ record.parent.firstName }} {{ record.parent.lastName }}
              </template>
              <template v-if="column.key === 'activityType'">
                {{ getActivityTypeLabel(record.activityType) }}
              </template>
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusLabel(record.status) }}
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
                    title="Ești sigur că vrei să ștergi această înscriere?"
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
        </div>
      </a-spin>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-cards">
      <a-spin :spinning="loading">
        <div v-if="filteredRegistrations.length === 0" class="empty-state">
          <p>Nu există înscrieri</p>
        </div>
        <div v-else>
          <a-pagination
            v-model:current="mobilePage"
            :total="filteredRegistrations.length"
            :page-size="mobilePageSize"
            :show-size-changer="false"
            simple
            class="mobile-pagination"
          />
          <div class="cards-list">
            <a-card
              v-for="record in paginatedMobileRegistrations"
              :key="record.id"
              class="registration-card"
            >
              <div class="card-header">
                <h3>{{ record.child.firstName }} {{ record.child.lastName }}</h3>
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusLabel(record.status) }}
                </a-tag>
              </div>
              <div class="card-content">
                <div class="card-item">
                  <strong>Vârstă:</strong> {{ record.child.age }} ani
                </div>
                <div class="card-item">
                  <strong>Părinte:</strong> {{ record.parent.firstName }} {{ record.parent.lastName }}
                </div>
                <div class="card-item">
                  <strong>Telefon:</strong> 
                  <a :href="`tel:${record.parent.phone}`">{{ record.parent.phone }}</a>
                </div>
                <div class="card-item">
                  <strong>Tip Activitate:</strong> {{ getActivityTypeLabel(record.activityType) }}
                </div>
              </div>
              <div class="card-actions">
                <a-button size="small" @click="viewRegistration(record)">
                  <EyeOutlined />
                  Vezi
                </a-button>
                <a-button size="small" @click="editRegistration(record)">
                  <EditOutlined />
                  Editează
                </a-button>
                <a-popconfirm
                  title="Ești sigur că vrei să ștergi?"
                  @confirm="deleteRegistration(record.id)"
                >
                  <a-button size="small" danger>
                    <DeleteOutlined />
                    Șterge
                  </a-button>
                </a-popconfirm>
              </div>
            </a-card>
          </div>
        </div>
      </a-spin>
    </div>

    <!-- View/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEditing ? 'Editează Înscrierea' : 'Vezi Înscrierea'"
      :width="800"
      :footer="null"
    >
      <div v-if="selectedRegistration" class="registration-details">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="Copil">
            {{ selectedRegistration.child.firstName }} {{ selectedRegistration.child.lastName }}
          </a-descriptions-item>
          <a-descriptions-item label="Vârstă">
            {{ selectedRegistration.child.age }} ani
          </a-descriptions-item>
          <a-descriptions-item label="Părinte">
            {{ selectedRegistration.parent.firstName }} {{ selectedRegistration.parent.lastName }}
          </a-descriptions-item>
          <a-descriptions-item label="Telefon">
            <a :href="`tel:${selectedRegistration.parent.phone}`">{{ selectedRegistration.parent.phone }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            <a :href="`mailto:${selectedRegistration.parent.email}`">{{ selectedRegistration.parent.email }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="Tip Activitate">
            {{ getActivityTypeLabel(selectedRegistration.activityType) }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-select
              v-model:value="selectedRegistration.status"
              @change="updateStatus"
            >
              <a-select-option value="pending">În așteptare</a-select-option>
              <a-select-option value="confirmed">Confirmat</a-select-option>
              <a-select-option value="cancelled">Anulat</a-select-option>
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
  { title: 'Copil', key: 'childName' },
  { title: 'Vârstă', dataIndex: ['child', 'age'] },
  { title: 'Părinte', key: 'parentName' },
  { title: 'Telefon', dataIndex: ['parent', 'phone'] },
  { title: 'Tip Activitate', key: 'activityType' },
  { title: 'Status', key: 'status' },
  { title: 'Acțiuni', key: 'actions', width: 150 }
]

const mobilePage = ref(1)
const mobilePageSize = ref(5)

const paginatedMobileRegistrations = computed(() => {
  const start = (mobilePage.value - 1) * mobilePageSize.value
  const end = start + mobilePageSize.value
  return filteredRegistrations.value.slice(start, end)
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'În așteptare',
    'confirmed': 'Confirmat',
    'cancelled': 'Anulat'
  }
  return labels[status] || status
}

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'camp': 'Tabără',
    'hike': 'Drumeție',
    'trip': 'Excursie',
    'ski': 'Ski',
    'swimming': 'Înot',
    'afterschool': 'După școală'
  }
  return labels[type] || type
}

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
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.mobile-cards {
  display: none;
}

.registration-details {
  max-height: 500px;
  overflow-y: auto;
}

/* Mobile Cards Styles */
.registration-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-content {
  margin-bottom: 16px;
}

.card-item {
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.card-item:last-child {
  border-bottom: none;
}

.card-item strong {
  display: inline-block;
  min-width: 120px;
  color: #666;
  font-weight: 500;
}

.card-item a {
  color: #1890ff;
  text-decoration: none;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mobile-pagination {
  margin-bottom: 16px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-registrations {
    padding: 12px;
  }

  .filters-section {
    padding: 16px;
  }

  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .table-section {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-cards {
    display: none;
  }
}
</style>



