<template>
  <div class="admin-hikes">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Drumeție
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="hike in hikes" :key="hike.id">
          <a-card class="hike-card" hoverable>
            <template #cover>
              <div class="hike-image">
                <img v-if="hike.gallery && hike.gallery.length > 0" :src="hike.gallery[0]" :alt="hike.name" />
                <EnvironmentOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ hike.name }}</h3>
              </template>
              <template #description>
                <p><strong>Județ:</strong> {{ getLocationDisplay(hike) }}</p>
                <p><strong>Dificultate:</strong> {{ getDifficultyLabel(hike.difficulty) }}</p>
                <p><strong>Durata:</strong> {{ hike.duration }}</p>
                <p><strong>Preț:</strong> {{ hike.price }} RON</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editHike(hike)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi această drumeție?"
                @confirm="deleteHike(hike.id)"
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
      :title="isEditing ? 'Editează Drumeția' : 'Adaugă Drumeție'"
      :width="800"
      @ok="saveHike"
      @cancel="resetForm"
    >
      <a-form :model="hikeForm" layout="vertical">
        <a-form-item label="Nume" required>
          <a-input v-model:value="hikeForm.name" placeholder="ex: Vârful Ciucaș" />
        </a-form-item>
        <a-form-item label="Județ" required>
          <a-select 
            v-model:value="hikeForm.countyId" 
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
            <a-form-item label="Dificultate" required>
              <a-select v-model:value="hikeForm.difficulty" placeholder="Selectează dificultatea">
                <a-select-option value="easy">Ușor</a-select-option>
                <a-select-option value="medium">Mediu</a-select-option>
                <a-select-option value="hard">Greu</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Durata" required>
              <a-input v-model:value="hikeForm.duration" placeholder="ex: 4-5 ore" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Distanță">
              <a-input v-model:value="hikeForm.distance" placeholder="ex: 8 km" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Altitudine">
              <a-input v-model:value="hikeForm.elevation" placeholder="ex: 1954 m" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Preț (RON)" required>
              <a-input-number v-model:value="hikeForm.price" style="width: 100%" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Participanți Maxim" required>
              <a-input-number v-model:value="hikeForm.maxParticipants" style="width: 100%" :min="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Punct de Întâlnire">
          <a-input v-model:value="hikeForm.meetingPoint" placeholder="ex: Parcarea de la intrare" />
        </a-form-item>
        <a-form-item label="Descriere" required>
          <a-textarea v-model:value="hikeForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Program">
          <a-textarea v-model:value="hikeForm.program" :rows="3" placeholder="Programul detali al drumeției" />
        </a-form-item>
        <a-form-item label="Detalii Suplimentare">
          <a-textarea v-model:value="hikeForm.details" :rows="3" placeholder="Informații suplimentare" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const hikes = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)
const counties = ref<any[]>([])
const loadingCounties = ref(false)

const hikeForm = ref<{
  id?: string
  name: string
  location?: string
  countyId?: string
  countyName?: string
  difficulty: string
  duration: string
  distance?: string
  elevation?: string
  description: string
  meetingPoint?: string
  price: number
  maxParticipants: number
  gallery?: string[]
  videos?: string[]
  program?: string
  details?: string
}>({
  name: '',
  location: '',
  countyId: '',
  countyName: '',
  difficulty: 'easy',
  duration: '',
  distance: '',
  elevation: '',
  description: '',
  meetingPoint: '',
  price: 0,
  maxParticipants: 0,
  gallery: [],
  videos: [],
  program: '',
  details: ''
})

const loadHikes = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/hikes')
    hikes.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load hikes:', error)
    hikes.value = []
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
  hikeForm.value.countyId = countyId
  const county = counties.value.find(c => c.id === countyId)
  hikeForm.value.countyName = county?.name || ''
}

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    'easy': 'Ușor',
    'medium': 'Mediu',
    'hard': 'Greu'
  }
  return labels[difficulty?.toLowerCase()] || 'Nespecificat'
}

const getLocationDisplay = (hike: any) => {
  if (hike.countyName) {
    return hike.countyName
  }
  if (hike.location) {
    return hike.location
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

const editHike = (hike: any) => {
  isEditing.value = true
  hikeForm.value = {
    ...hike
  }
  modalVisible.value = true
}

const resetForm = () => {
  hikeForm.value = {
    id: undefined,
    name: '',
    location: '',
    countyId: '',
    countyName: '',
    difficulty: 'easy',
    duration: '',
    distance: '',
    elevation: '',
    description: '',
    meetingPoint: '',
    price: 0,
    maxParticipants: 0,
    gallery: [],
    videos: [],
    program: '',
    details: ''
  }
}

const saveHike = async () => {
  if (!hikeForm.value.countyId) {
    message.warning('Te rog selectează județul')
    return
  }

  try {
    // Get county name
    const selectedCounty = counties.value.find(c => c.id === hikeForm.value.countyId)
    
    const data = {
      ...hikeForm.value,
      countyName: selectedCounty?.name || hikeForm.value.countyName || ''
    }

    // Remove undefined fields
    delete data.id

    if (isEditing.value && hikeForm.value.id) {
      await $fetch(`/api/hikes/${hikeForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Drumeția a fost actualizată cu succes')
    } else {
      await $fetch('/api/hikes', {
        method: 'POST',
        body: data
      })
      message.success('Drumeția a fost adăugată cu succes')
    }

    modalVisible.value = false
    await loadHikes()
  } catch (error) {
    console.error('Failed to save hike:', error)
    message.error('Eroare la salvarea drumeției')
  }
}

const deleteHike = async (id: string) => {
  try {
    await $fetch(`/api/hikes/${id}`, { method: 'DELETE' })
    message.success('Drumeția a fost ștearsă cu succes')
    await loadHikes()
  } catch (error) {
    console.error('Failed to delete hike:', error)
    message.error('Eroare la ștergerea drumeției')
  }
}

onMounted(() => {
  loadHikes()
  loadCounties()
})
</script>

<style scoped>
.admin-hikes {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.hike-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.hike-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.hike-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hike-image :deep(.anticon) {
  font-size: 3rem;
}

.hike-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}
</style>



