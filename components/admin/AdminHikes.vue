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
      :width="isMobile ? '95%' : 800"
      :wrap-class-name="'admin-modal-wrapper'"
      :body-style="{ maxHeight: isMobile ? '70vh' : 'none', overflowY: 'auto', padding: isMobile ? '16px' : '24px' }"
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
            :getPopupContainer="getPopupContainer"
          >
            <a-select-option v-for="county in counties" :key="county.id" :value="county.id">
              {{ county.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Dificultate" required>
              <a-select 
                v-model:value="hikeForm.difficulty" 
                placeholder="Selectează dificultatea"
                :getPopupContainer="getPopupContainer"
              >
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
        <a-form-item label="Imagine Principală">
          <a-upload
            v-model:file-list="imageFileList"
            :before-upload="beforeUpload"
            :custom-request="handleImageUpload"
            :list-type="isMobile ? 'picture' : 'picture-card'"
            :max-count="1"
            accept="image/*"
            :show-upload-list="true"
          >
            <div v-if="imageFileList.length < 1" :class="isMobile ? 'mobile-upload-btn' : ''">
              <PlusOutlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
          <div v-if="hikeForm.gallery && hikeForm.gallery.length > 0" style="margin-top: 16px;">
            <p style="margin-bottom: 8px; color: #666;">Imagine actuală:</p>
            <img :src="hikeForm.gallery[0]" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #d9d9d9;" />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { computed } from 'vue'
import { compressImage } from '~/composables/useImageCompression'

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

const imageFileList = ref<any[]>([])
const uploading = ref(false)

// Detect mobile device
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth <= 768
  }
  return false
})

// Helper pentru getPopupContainer - pe mobile folosește document.body
const getPopupContainer = (trigger: HTMLElement) => {
  if (!process.client || !document || !document.body) {
    // Fallback pentru SSR sau când document nu e disponibil
    return trigger?.parentElement || (process.client && document?.body ? document.body : document?.documentElement)
  }
  if (isMobile.value) {
    return document.body
  }
  return trigger?.parentElement || document.body
}

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
  // Pe mobile, file poate fi direct File object sau poate fi într-un wrapper
  const fileObj = file.originFileObj || file
  
  imageFileList.value = [{
    uid: file.uid || '-1',
    name: file.name || fileObj.name,
    status: 'done',
    url: file.url || (fileObj ? URL.createObjectURL(fileObj) : ''),
    originFileObj: fileObj, // Păstrăm referința la fișierul original
    file: fileObj // Backup pentru mobile
  }]
  message.success('Imaginea a fost selectată! Va fi încărcată la salvare.')
  return false
}

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
  // Setează file list pentru imaginea existentă
  if (hike.gallery && hike.gallery.length > 0) {
    imageFileList.value = [{
      uid: '-1',
      name: 'imagine-actuala.jpg',
      status: 'done',
      url: hike.gallery[0]
    }]
  } else {
    imageFileList.value = []
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
  imageFileList.value = []
  isEditing.value = false
}

const saveHike = async () => {
  if (!hikeForm.value.countyId) {
    message.warning('Te rog selectează județul')
    return
  }

  try {
    // Upload image if there's a new file to upload
    let imageUrl = null
    if (imageFileList.value.length > 0) {
      const fileItem = imageFileList.value[0]
      // Check if there's actually a new file to upload (not just an existing URL)
      const hasNewFile = fileItem?.originFileObj || fileItem?.file
      if (!hasNewFile) {
        // No new file, skip upload and use existing gallery
        imageUrl = null
      } else {
        let f: any = fileItem.originFileObj || fileItem.file
      
        // Acceptă și Blob (iOS uneori livrează Blob / wrapper)
        const isFileOrBlob = f && (f instanceof File || f instanceof Blob)
        if (!isFileOrBlob) {
          message.error('Fișier invalid pentru upload.')
          return
        }
        
        // iOS/Safari poate da Blob -> îl transformăm în File cu nume
        if (!(f instanceof File)) {
          const ext = (f.type?.split('/')?.[1] || 'jpg').replace('jpeg', 'jpg')
          f = new File([f], `upload_${Date.now()}.${ext}`, { type: f.type || 'image/jpeg' })
        }
        
        try {
          // Comprimă imaginea înainte de upload (reduce dimensiunea pentru a evita 413)
          message.loading({ content: 'Se comprimă imaginea...', key: 'compressing', duration: 0 })
          const compressedFile = await compressImage(f, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.8,
            maxSizeMB: 2
          })
          message.destroy('compressing')
          
          const formData = new FormData()
          // IMPORTANT: filename explicit (fix pentru iOS Safari)
          formData.append('file', compressedFile, compressedFile.name)
          formData.append('folder', 'hikes')
          
          const uploadResponse: any = await $fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          
          if (uploadResponse?.uploads?.length) {
            imageUrl = uploadResponse.uploads[0].url
            console.log('Image uploaded during save, URL:', imageUrl)
          } else {
            message.error('Eroare: nu s-a primit URL după upload.')
            return
          }
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError)
          message.error(`Eroare la încărcarea imaginii: ${uploadError?.message || 'Eroare necunoscută'}`)
          return
        }
      }
    }
    
    // Get county name
    const selectedCounty = counties.value.find(c => c.id === hikeForm.value.countyId)
    
    // Build gallery array - use uploaded image or existing gallery
    let galleryArray = []
    if (imageUrl) {
      galleryArray = [imageUrl]
    } else if (Array.isArray(hikeForm.value.gallery) && hikeForm.value.gallery.length > 0) {
      galleryArray = [...hikeForm.value.gallery]
    }
    
    const data = {
      ...hikeForm.value,
      countyName: selectedCounty?.name || hikeForm.value.countyName || '',
      gallery: galleryArray
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
    resetForm()
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hike-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hike-card :deep(.ant-card-meta) {
  flex: 1;
}

.hike-card :deep(.ant-card-actions) {
  margin-top: auto;
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

/* Mobile upload button styles */
.mobile-upload-btn {
  width: 100% !important;
  min-height: 80px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 16px !important;
  border: 2px dashed #d9d9d9 !important;
  border-radius: 8px !important;
  background: #fafafa !important;
  cursor: pointer !important;
}

.mobile-upload-btn:hover {
  border-color: #1890ff !important;
  background: #f0f7ff !important;
}

/* Ensure upload component is touch-friendly on mobile */
@media (max-width: 768px) {
  .admin-hikes :deep(.ant-upload-select) {
    width: 100% !important;
    height: auto !important;
    min-height: 80px !important;
  }
  
  .admin-hikes :deep(.ant-upload-select-picture-card) {
    width: 100% !important;
    height: 80px !important;
  }
  
  .admin-hikes :deep(.ant-upload-list-picture) {
    width: 100% !important;
  }
  
  .admin-hikes :deep(.ant-upload-list-item) {
    width: 100% !important;
    margin-top: 16px !important;
  }
}
</style>



