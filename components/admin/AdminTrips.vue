<template>
  <div class="admin-trips">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Excursie
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="trip in trips" :key="trip.id">
          <a-card class="trip-card" hoverable>
            <template #cover>
              <div class="trip-image">
                <img v-if="trip.gallery && trip.gallery.length > 0" :src="trip.gallery[0]" :alt="trip.name" />
                <CarOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ trip.name }}</h3>
              </template>
              <template #description>
                <p><strong>Județ:</strong> {{ getLocationDisplay(trip) }}</p>
                <p><strong>Dată:</strong> {{ trip.date }}</p>
                <p><strong>Durata:</strong> {{ trip.duration }}</p>
                <p><strong>Preț:</strong> {{ trip.price }} RON</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editTrip(trip)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi această excursie?"
                @confirm="deleteTrip(trip.id)"
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
      :title="isEditing ? 'Editează Excursia' : 'Adaugă Excursie'"
      :width="800"
      @ok="saveTrip"
      @cancel="resetForm"
    >
      <a-form :model="tripForm" layout="vertical">
        <a-form-item label="Nume" required>
          <a-input v-model:value="tripForm.name" placeholder="ex: Excursie la București" />
        </a-form-item>
        <a-form-item label="Județ" required>
          <a-select 
            v-model:value="tripForm.countyId" 
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
            <a-form-item label="Dată" required>
              <a-date-picker 
                v-model:value="tripForm.date" 
                style="width: 100%"
                format="YYYY-MM-DD"
                :placeholder="'Selectează data'"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Durata" required>
              <a-input v-model:value="tripForm.duration" placeholder="ex: 1 zi, 2 zile" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Preț (RON)" required>
              <a-input-number v-model:value="tripForm.price" style="width: 100%" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Participanți Maxim" required>
              <a-input-number v-model:value="tripForm.maxParticipants" style="width: 100%" :min="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Descriere" required>
          <a-textarea v-model:value="tripForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Program">
          <a-textarea v-model:value="tripForm.program" :rows="3" placeholder="Programul detali al excursiei" />
        </a-form-item>
        <a-form-item label="Detalii Suplimentare">
          <a-textarea v-model:value="tripForm.details" :rows="3" placeholder="Informații suplimentare" />
        </a-form-item>
        <a-form-item label="Imagine Principală">
          <a-upload
            v-model:file-list="imageFileList"
            :before-upload="beforeUpload"
            :custom-request="handleImageUpload"
            list-type="picture-card"
            :max-count="1"
            accept="image/*"
          >
            <div v-if="imageFileList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
          <div v-if="tripForm.gallery && tripForm.gallery.length > 0" style="margin-top: 16px;">
            <p style="margin-bottom: 8px; color: #666;">Imagine actuală:</p>
            <img :src="tripForm.gallery[0]" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #d9d9d9;" />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, CarOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import type { UploadProps } from 'ant-design-vue'

const loading = ref(false)
const trips = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)
const counties = ref<any[]>([])
const loadingCounties = ref(false)

const tripForm = ref<{
  id?: string
  name: string
  destination?: string
  countyId?: string
  countyName?: string
  date: string | Dayjs | null
  description: string
  price: number
  maxParticipants: number
  duration: string
  gallery?: string[]
  videos?: string[]
  program?: string
  details?: string
}>({
  name: '',
  destination: '',
  countyId: '',
  countyName: '',
  date: null,
  description: '',
  price: 0,
  maxParticipants: 0,
  duration: '',
  gallery: [],
  videos: [],
  program: '',
  details: ''
})

const imageFileList = ref<any[]>([])
const uploading = ref(false)

const beforeUpload: UploadProps['beforeUpload'] = (file: File) => {
  const isImage = file.type?.startsWith('image/')
  if (!isImage) {
    message.error('Poți încărca doar imagini!')
    return false
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('Imaginea trebuie să fie mai mică de 10MB!')
    return false
  }
  return false
}

const handleImageUpload = async (options: any) => {
  const { file } = options
  imageFileList.value = [{
    uid: '-1',
    name: file.name,
    status: 'done',
    url: URL.createObjectURL(file),
    originFileObj: file
  }]
  message.success('Imaginea a fost selectată! Va fi încărcată la salvare.')
  return false
}

const loadTrips = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/trips')
    trips.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load trips:', error)
    trips.value = []
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
  tripForm.value.countyId = countyId
  const county = counties.value.find(c => c.id === countyId)
  tripForm.value.countyName = county?.name || ''
}

const getLocationDisplay = (trip: any) => {
  if (trip.countyName) {
    return trip.countyName
  }
  if (trip.destination) {
    // Fallback pentru vechile date
    const labels: Record<string, string> = {
      'bucharest': 'București',
      'targu_mures': 'Târgu Mureș',
      'sibiu': 'Sibiu'
    }
    return labels[trip.destination] || trip.destination
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

const editTrip = (trip: any) => {
  isEditing.value = true
  tripForm.value = {
    ...trip,
    date: trip.date ? dayjs(trip.date) : null
  }
  // Setează file list pentru imaginea existentă
  if (trip.gallery && trip.gallery.length > 0) {
    imageFileList.value = [{
      uid: '-1',
      name: 'imagine-actuala.jpg',
      status: 'done',
      url: trip.gallery[0]
    }]
  } else {
    imageFileList.value = []
  }
  modalVisible.value = true
}

const resetForm = () => {
  tripForm.value = {
    id: undefined,
    name: '',
    destination: '',
    countyId: '',
    countyName: '',
    date: null,
    description: '',
    price: 0,
    maxParticipants: 0,
    duration: '',
    gallery: [],
    videos: [],
    program: '',
    details: ''
  }
  imageFileList.value = []
  isEditing.value = false
}

const saveTrip = async () => {
  if (!tripForm.value.countyId) {
    message.warning('Te rog selectează județul')
    return
  }

  try {
    // Upload image if there's a new file to upload
    let imageUrl = null
    if (imageFileList.value.length > 0 && imageFileList.value[0].originFileObj) {
      const file = imageFileList.value[0].originFileObj
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'trips')
      
      const uploadResponse = await $fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (uploadResponse.uploads && uploadResponse.uploads.length > 0) {
        imageUrl = uploadResponse.uploads[0].url
        console.log('Image uploaded during save, URL:', imageUrl)
      } else {
        message.error('Eroare: Nu s-a primit URL-ul imaginii după upload.')
        return
      }
    }
    
    // Get county name
    const selectedCounty = counties.value.find(c => c.id === tripForm.value.countyId)
    
    // Build gallery array - use uploaded image or existing gallery
    let galleryArray = []
    if (imageUrl) {
      galleryArray = [imageUrl]
    } else if (Array.isArray(tripForm.value.gallery) && tripForm.value.gallery.length > 0) {
      galleryArray = [...tripForm.value.gallery]
    }
    
    // Format date
    const formattedDate = tripForm.value.date 
      ? (dayjs.isDayjs(tripForm.value.date) ? tripForm.value.date.format('YYYY-MM-DD') : tripForm.value.date)
      : ''

    const data = {
      ...tripForm.value,
      countyName: selectedCounty?.name || tripForm.value.countyName || '',
      date: formattedDate,
      gallery: galleryArray
    }

    // Remove undefined fields and dayjs object
    delete data.id
    if (dayjs.isDayjs(data.date)) {
      data.date = data.date.format('YYYY-MM-DD')
    }

    if (isEditing.value && tripForm.value.id) {
      await $fetch(`/api/trips/${tripForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Excursia a fost actualizată cu succes')
    } else {
      await $fetch('/api/trips', {
        method: 'POST',
        body: data
      })
      message.success('Excursia a fost adăugată cu succes')
    }

    modalVisible.value = false
    await loadTrips()
  } catch (error) {
    console.error('Failed to save trip:', error)
    message.error('Eroare la salvarea excursiei')
  }
}

const deleteTrip = async (id: string) => {
  try {
    await $fetch(`/api/trips/${id}`, { method: 'DELETE' })
    message.success('Excursia a fost ștearsă cu succes')
    await loadTrips()
  } catch (error) {
    console.error('Failed to delete trip:', error)
    message.error('Eroare la ștergerea excursiei')
  }
}

onMounted(() => {
  loadTrips()
  loadCounties()
})
</script>

<style scoped>
.admin-trips {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.trip-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trip-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.trip-card :deep(.ant-card-meta) {
  flex: 1;
}

.trip-card :deep(.ant-card-actions) {
  margin-top: auto;
}

.trip-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.trip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trip-image :deep(.anticon) {
  font-size: 3rem;
}

.trip-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}
</style>



