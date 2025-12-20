<template>
  <div class="admin-camps">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Tabără
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="camp in camps" :key="camp.id">
          <a-card class="camp-card" hoverable>
            <template #cover>
              <div class="camp-image">
                <img v-if="camp.gallery && camp.gallery.length > 0" :src="camp.gallery[0]" :alt="camp.name" />
                <TeamOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ camp.name }}</h3>
              </template>
              <template #description>
                <p><strong>Locația:</strong> {{ getLocationDisplay(camp) }}</p>
                <p><strong>Perioada:</strong> {{ camp.startDate }} - {{ camp.endDate }}</p>
                <p><strong>Preț:</strong> {{ camp.price }} RON</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editCamp(camp)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi această tabără?"
                @confirm="deleteCamp(camp.id)"
              >
                <a-button danger>
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>

    <!-- Add/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEditing ? 'Editează Tabără' : 'Adaugă Tabără'"
      :width="800"
      @ok="saveCamp"
      @cancel="resetForm"
    >
      <a-form :model="campForm" layout="vertical">
        <a-form-item label="Nume" required>
          <a-input v-model:value="campForm.name" />
        </a-form-item>
        <a-form-item label="Județ" required>
          <a-select 
            v-model:value="campForm.countyId" 
            placeholder="Selectează județul"
            @change="onCountyChange"
            :loading="loadingCounties"
          >
            <a-select-option v-for="county in counties" :key="county.id" :value="county.id">
              {{ county.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="An" required>
              <a-input-number v-model:value="campForm.year" style="width: 100%" :min="2024" :max="2030" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Preț (RON)" required>
              <a-input-number v-model:value="campForm.price" style="width: 100%" :min="0" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Data Început" required>
              <a-date-picker v-model:value="campForm.startDate" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Data Sfârșit" required>
              <a-date-picker v-model:value="campForm.endDate" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Descriere" required>
          <a-textarea v-model:value="campForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Participanți Maxim" required>
          <a-input-number v-model:value="campForm.maxParticipants" style="width: 100%" :min="1" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'

const loading = ref(false)
const camps = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)
const counties = ref<any[]>([])
const loadingCounties = ref(false)

const campForm = ref<{
  id?: string
  name: string
  location?: string
  countyId?: string
  countyName?: string
  year: number
  startDate: any
  endDate: any
  description: string
  price: number
  maxParticipants: number
}>({
  name: '',
  location: '',
  countyId: '',
  countyName: '',
  year: new Date().getFullYear(),
  startDate: null,
  endDate: null,
  description: '',
  price: 0,
  maxParticipants: 0
})

const loadCamps = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/camps')
    camps.value = Array.isArray(response) ? response : []
    console.log('Loaded camps:', camps.value.length)
  } catch (error) {
    console.error('Failed to load camps:', error)
    camps.value = []
  } finally {
    loading.value = false
  }
}

const loadCounties = async () => {
  loadingCounties.value = true
  try {
    const response = await $fetch('/api/counties')
    counties.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load counties:', error)
    counties.value = []
  } finally {
    loadingCounties.value = false
  }
}

const onCountyChange = (countyId: string) => {
  campForm.value.countyId = countyId
  const county = counties.value.find(c => c.id === countyId)
  campForm.value.countyName = county?.name || ''
}

const getLocationDisplay = (camp: any) => {
  if (camp.countyName) {
    return camp.countyName
  }
  if (camp.location) {
    // Fallback pentru datele vechi
    const labels: Record<string, string> = {
      'straja': 'Straja',
      'rafting': 'Rafting',
      'danube_delta': 'Delta Dunării',
      'colibita': 'Colibița'
    }
    return labels[camp.location] || camp.location
  }
  return 'Nespecificat'
}

const showAddModal = () => {
  console.log('showAddModal called')
  isEditing.value = false
  resetForm()
  modalVisible.value = true
  console.log('modalVisible set to:', modalVisible.value)
}

const editCamp = async (camp: any) => {
  isEditing.value = true
  campForm.value = {
    ...camp,
    startDate: camp.startDate ? dayjs(camp.startDate) : null,
    endDate: camp.endDate ? dayjs(camp.endDate) : null
  }
  modalVisible.value = true
}

const resetForm = () => {
  campForm.value = {
    id: undefined,
    name: '',
    location: '',
    countyId: '',
    countyName: '',
    year: new Date().getFullYear(),
    startDate: null,
    endDate: null,
    description: '',
    price: 0,
    maxParticipants: 0
  }
}

const saveCamp = async () => {
  if (!campForm.value.countyId) {
    message.warning('Te rog selectează județul')
    return
  }

  try {
    // Get county name
    const selectedCounty = counties.value.find(c => c.id === campForm.value.countyId)
    
    const data = {
      ...campForm.value,
      countyName: selectedCounty?.name || campForm.value.countyName || '',
      startDate: campForm.value.startDate ? dayjs(campForm.value.startDate).format('YYYY-MM-DD') : null,
      endDate: campForm.value.endDate ? dayjs(campForm.value.endDate).format('YYYY-MM-DD') : null
    }

    // Remove undefined fields
    delete data.id
    if (!data.location) delete data.location

    if (isEditing.value && campForm.value.id) {
      await $fetch(`/api/camps/${campForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Tabăra a fost actualizată cu succes')
    } else {
      await $fetch('/api/camps', {
        method: 'POST',
        body: data
      })
      message.success('Tabăra a fost adăugată cu succes')
    }

    modalVisible.value = false
    await loadCamps()
  } catch (error) {
    console.error('Failed to save camp:', error)
    message.error('Eroare la salvarea taberei')
  }
}

const deleteCamp = async (id: string) => {
  try {
    await $fetch(`/api/camps/${id}`, { method: 'DELETE' })
    await loadCamps()
  } catch (error) {
    console.error('Failed to delete camp:', error)
  }
}

onMounted(() => {
  loadCamps()
  loadCounties()
})
</script>

<style scoped>
.admin-camps {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}


.camp-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.camp-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.camp-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camp-image :deep(.anticon) {
  font-size: 3rem;
}
</style>



