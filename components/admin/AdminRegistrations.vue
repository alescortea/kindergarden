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
            <a-select-option value="afterschool">Program Afterschool (9-17)</a-select-option>
            <a-select-option value="school-offer">Ofertă Școlară</a-select-option>
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
      :width="modalWidth"
      :footer="null"
      :wrap-class-name="'registration-modal'"
      :class="'registration-modal-wrapper'"
      @cancel="handleModalCancel"
    >
      <div v-if="selectedRegistration" class="registration-details">
        <!-- View Mode -->
        <template v-if="!isEditing">
          <a-descriptions :column="descriptionColumns" bordered>
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
              <a :href="`tel:${selectedRegistration.parent.phone}`" class="contact-link">
                {{ selectedRegistration.parent.phone }}
              </a>
            </a-descriptions-item>
            <a-descriptions-item label="Email">
              <a :href="`mailto:${selectedRegistration.parent.email}`" class="contact-link">
                {{ selectedRegistration.parent.email }}
              </a>
            </a-descriptions-item>
          <a-descriptions-item label="Tip Activitate">
            {{ getActivityTypeLabel(selectedRegistration.activityType) }}
          </a-descriptions-item>
          <!-- Afterschool Program Details -->
          <template v-if="selectedRegistration.afterschool">
            <a-descriptions-item label="Program Zilnic">
              {{ getScheduleLabel(selectedRegistration.afterschool.schedule) }}
            </a-descriptions-item>
            <a-descriptions-item label="Zile pe Săptămână">
              {{ selectedRegistration.afterschool.daysPerWeek }} {{ selectedRegistration.afterschool.daysPerWeek === '5' ? 'zile' : 'zi' }}/săptămână
            </a-descriptions-item>
            <a-descriptions-item label="Zile Preferate" v-if="selectedRegistration.afterschool.preferredDays && selectedRegistration.afterschool.preferredDays.length > 0">
              {{ getPreferredDaysLabel(selectedRegistration.afterschool.preferredDays) }}
            </a-descriptions-item>
            <a-descriptions-item label="Data Începerii" v-if="selectedRegistration.afterschool.startDate">
              {{ selectedRegistration.afterschool.startDate }}
            </a-descriptions-item>
          </template>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(selectedRegistration.status)">
              {{ getStatusLabel(selectedRegistration.status) }}
            </a-tag>
          </a-descriptions-item>
          </a-descriptions>
          <div class="modal-actions">
            <a-button type="primary" @click="modalVisible = false" block>
              Închide
            </a-button>
          </div>
        </template>

        <!-- Edit Mode -->
        <template v-else>
          <a-form :model="editForm" layout="vertical" @submit.prevent="saveRegistration">
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Prenume Copil" required>
                  <a-input v-model:value="editForm.child.firstName" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Nume Copil" required>
                  <a-input v-model:value="editForm.child.lastName" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Vârstă" required>
                  <a-input-number 
                    v-model:value="editForm.child.age" 
                    :min="1" 
                    :max="18" 
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider>Date Părinte</a-divider>
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Prenume Părinte" required>
                  <a-input v-model:value="editForm.parent.firstName" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Nume Părinte" required>
                  <a-input v-model:value="editForm.parent.lastName" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Telefon" required>
                  <a-input v-model:value="editForm.parent.phone" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Email" required>
                  <a-input v-model:value="editForm.parent.email" type="email" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider>Detalii Înscriere</a-divider>
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Tip Activitate" required>
                  <a-select v-model:value="editForm.activityType" style="width: 100%">
                    <a-select-option value="camp">Tabără</a-select-option>
                    <a-select-option value="hike">Drumeție</a-select-option>
                    <a-select-option value="trip">Excursie</a-select-option>
                    <a-select-option value="ski">Ski</a-select-option>
                    <a-select-option value="swimming">Înot</a-select-option>
                    <a-select-option value="afterschool">Program Afterschool (9-17)</a-select-option>
                    <a-select-option value="school-offer">Ofertă Școlară</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Status" required>
                  <a-select v-model:value="editForm.status" style="width: 100%">
                    <a-select-option value="pending">În așteptare</a-select-option>
                    <a-select-option value="confirmed">Confirmat</a-select-option>
                    <a-select-option value="cancelled">Anulat</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <!-- Afterschool Program Fields -->
            <template v-if="editForm.activityType === 'afterschool'">
              <a-divider>Detalii Program Afterschool</a-divider>
              <a-row :gutter="16">
                <a-col :xs="24" :sm="12">
                  <a-form-item label="Program Zilnic">
                    <a-select v-model:value="editForm.afterschool.schedule" style="width: 100%">
                      <a-select-option value="full-time">Program Complet (9:00 - 17:00)</a-select-option>
                      <a-select-option value="morning">Dimineață (9:00 - 13:00)</a-select-option>
                      <a-select-option value="afternoon">După-amiază (13:00 - 17:00)</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12">
                  <a-form-item label="Zile pe Săptămână">
                    <a-select v-model:value="editForm.afterschool.daysPerWeek" style="width: 100%">
                      <a-select-option value="1">1 zi/săptămână</a-select-option>
                      <a-select-option value="2">2 zile/săptămână</a-select-option>
                      <a-select-option value="3">3 zile/săptămână</a-select-option>
                      <a-select-option value="4">4 zile/săptămână</a-select-option>
                      <a-select-option value="5">5 zile/săptămână (Luni-Vineri)</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :xs="24">
                  <a-form-item label="Zile Preferate">
                    <a-checkbox-group v-model:value="editForm.afterschool.preferredDays">
                      <a-space>
                        <a-checkbox value="monday">Luni</a-checkbox>
                        <a-checkbox value="tuesday">Marți</a-checkbox>
                        <a-checkbox value="wednesday">Miercuri</a-checkbox>
                        <a-checkbox value="thursday">Joi</a-checkbox>
                        <a-checkbox value="friday">Vineri</a-checkbox>
                      </a-space>
                    </a-checkbox-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :xs="24" :sm="12">
                  <a-form-item label="Data Începerii">
                    <a-date-picker
                      v-model:value="editForm.afterschool.startDate"
                      style="width: 100%"
                      format="YYYY-MM-DD"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
            <div class="modal-actions">
              <a-space>
                <a-button @click="handleModalCancel">
                  Anulează
                </a-button>
                <a-button type="primary" @click="saveRegistration" :loading="saving">
                  Salvează
                </a-button>
              </a-space>
            </div>
          </a-form>
        </template>
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
import { message } from 'ant-design-vue'
import * as XLSX from 'xlsx'
import dayjs, { type Dayjs } from 'dayjs'

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
const saving = ref(false)

const editForm = ref({
  child: {
    firstName: '',
    lastName: '',
    age: 0
  },
  parent: {
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  },
  activityType: '',
  status: '',
  afterschool: {
    schedule: '',
    daysPerWeek: '',
    preferredDays: [] as string[],
    startDate: null as any
  }
})

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

const modalWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768 ? '95%' : 800
  }
  return 800
})

const descriptionColumns = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768 ? 1 : 2
  }
  return 2
})

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
  return labels[status?.toLowerCase()] || 'Nespecificat'
}

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'camp': 'Tabără',
    'hike': 'Drumeție',
    'trip': 'Excursie',
    'ski': 'Ski',
    'swimming': 'Înot',
    'afterschool': 'Program Afterschool (9-17)',
    'school-offer': 'Ofertă Școlară'
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
  // Initialize edit form with current values
  editForm.value = {
    child: {
      firstName: registration.child.firstName || '',
      lastName: registration.child.lastName || '',
      age: registration.child.age || 0
    },
    parent: {
      firstName: registration.parent.firstName || '',
      lastName: registration.parent.lastName || '',
      phone: registration.parent.phone || '',
      email: registration.parent.email || ''
    },
    activityType: registration.activityType || '',
    status: registration.status || 'pending',
    afterschool: {
      schedule: registration.afterschool?.schedule || '',
      daysPerWeek: registration.afterschool?.daysPerWeek || '',
      preferredDays: registration.afterschool?.preferredDays || [],
      startDate: registration.afterschool?.startDate ? dayjs(registration.afterschool.startDate) : null
    }
  }
  isEditing.value = true
  modalVisible.value = true
}

const handleModalCancel = () => {
  modalVisible.value = false
  isEditing.value = false
  // Reset form
  editForm.value = {
    child: { firstName: '', lastName: '', age: 0 },
    parent: { firstName: '', lastName: '', phone: '', email: '' },
    activityType: '',
    status: '',
    afterschool: {
      schedule: '',
      daysPerWeek: '',
      preferredDays: [],
      startDate: null
    }
  }
}

const getScheduleLabel = (schedule: string) => {
  const labels: Record<string, string> = {
    'full': 'Program Complet (9:00 - 17:00)',
    'full-time': 'Program Complet (9:00 - 17:00)',
    'morning': 'Dimineață (9:00 - 13:00)',
    'afternoon': 'După-amiază (13:00 - 17:00)'
  }
  return labels[schedule?.toLowerCase()] || 'Nespecificat'
}

const getPreferredDaysLabel = (days: string[]) => {
  if (!days || days.length === 0) return 'Nespecificat'
  const dayLabels: Record<string, string> = {
    'monday': 'Luni',
    'tuesday': 'Marți',
    'wednesday': 'Miercuri',
    'thursday': 'Joi',
    'friday': 'Vineri'
  }
  return days.map(day => dayLabels[day] || day).join(', ')
}

const saveRegistration = async () => {
  if (!selectedRegistration.value) return

  // Validation
  if (!editForm.value.child.firstName || !editForm.value.child.lastName) {
    message.warning('Te rog completează numele copilului')
    return
  }
  if (!editForm.value.child.age || editForm.value.child.age < 1) {
    message.warning('Te rog introdu o vârstă validă')
    return
  }
  if (!editForm.value.parent.firstName || !editForm.value.parent.lastName) {
    message.warning('Te rog completează numele părintelui')
    return
  }
  if (!editForm.value.parent.phone) {
    message.warning('Te rog introdu numărul de telefon')
    return
  }
  if (!editForm.value.parent.email) {
    message.warning('Te rog introdu adresa de email')
    return
  }

  saving.value = true
  try {
    const updateData: any = {
      child: editForm.value.child,
      parent: editForm.value.parent,
      activityType: editForm.value.activityType,
      status: editForm.value.status
    }

    // Include afterschool data if applicable
    if (editForm.value.activityType === 'afterschool') {
      updateData.afterschool = {
        ...editForm.value.afterschool,
        startDate: editForm.value.afterschool.startDate
          ? (dayjs.isDayjs(editForm.value.afterschool.startDate) 
              ? editForm.value.afterschool.startDate.format('YYYY-MM-DD')
              : editForm.value.afterschool.startDate)
          : null
      }
    }

    await $fetch(`/api/registrations/${selectedRegistration.value.id}`, {
      method: 'PATCH',
      body: updateData
    })
    message.success('Înscrierea a fost actualizată cu succes')
    await loadRegistrations()
    modalVisible.value = false
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update registration:', error)
    message.error('Eroare la actualizarea înscrierii')
  } finally {
    saving.value = false
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
  max-height: 70vh;
  overflow-y: auto;
  padding: 8px 0;
}

.registration-details :deep(.ant-descriptions-item-label) {
  font-weight: 600;
  background: #fafafa;
  width: 40%;
}

.registration-details :deep(.ant-descriptions-item-content) {
  width: 60%;
}

.contact-link {
  color: #1890ff;
  text-decoration: none;
  word-break: break-all;
}

.contact-link:hover {
  text-decoration: underline;
}

.modal-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* Mobile Modal Styles */
:deep(.registration-modal) {
  top: 20px;
}

:deep(.registration-modal-wrapper) {
  padding: 0;
}

@media (max-width: 768px) {
  .registration-details {
    max-height: calc(100vh - 120px);
    padding: 4px 0;
  }

  .registration-details :deep(.ant-descriptions-item-label) {
    width: 35%;
    font-size: 14px;
    padding: 8px 12px;
  }

  .registration-details :deep(.ant-descriptions-item-content) {
    width: 65%;
    font-size: 14px;
    padding: 8px 12px;
  }

  .registration-details :deep(.ant-descriptions-row) {
    display: flex;
    flex-direction: column;
  }

  .registration-details :deep(.ant-descriptions-item) {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  .registration-details :deep(.ant-descriptions-item-label) {
    width: 100%;
    margin-bottom: 4px;
    font-weight: 600;
    color: #666;
  }

  .registration-details :deep(.ant-descriptions-item-content) {
    width: 100%;
  }

  :deep(.registration-modal .ant-modal) {
    margin: 10px auto;
    max-width: 95%;
  }

  :deep(.registration-modal .ant-modal-content) {
    border-radius: 12px;
  }

  :deep(.registration-modal .ant-modal-header) {
    padding: 16px;
    border-radius: 12px 12px 0 0;
  }

  :deep(.registration-modal .ant-modal-title) {
    font-size: 18px;
  }

  :deep(.registration-modal .ant-modal-body) {
    padding: 16px;
    max-height: calc(100vh - 150px);
    overflow-y: auto;
  }

  :deep(.registration-modal .ant-modal-close) {
    top: 16px;
    right: 16px;
  }
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



