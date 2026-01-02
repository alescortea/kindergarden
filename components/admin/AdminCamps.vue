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
      :width="isMobile ? '95%' : 800"
      :wrap-class-name="'admin-modal-wrapper'"
      :body-style="{ maxHeight: isMobile ? '70vh' : 'none', overflowY: 'auto', padding: isMobile ? '16px' : '24px' }"
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
            :getPopupContainer="getPopupContainer"
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
              <a-date-picker 
                v-model:value="campForm.startDate" 
                style="width: 100%"
                :getPopupContainer="getPopupContainer"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Data Sfârșit" required>
              <a-date-picker 
                v-model:value="campForm.endDate" 
                style="width: 100%"
                :getPopupContainer="getPopupContainer"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Descriere" required>
          <a-textarea v-model:value="campForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Participanți Maxim" required>
          <a-input-number v-model:value="campForm.maxParticipants" style="width: 100%" :min="1" />
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
          <div v-if="campForm.gallery && campForm.gallery.length > 0" style="margin-top: 16px;">
            <p style="margin-bottom: 8px; color: #666;">Imagine actuală:</p>
            <img :src="campForm.gallery[0]" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #d9d9d9;" />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { computed } from 'vue'
import { compressImage } from '~/composables/useImageCompression'

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
  gallery?: string[]
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
  maxParticipants: 0,
  gallery: []
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
  return false // Previne upload-ul automat
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
  // Setează file list pentru imaginea existentă
  if (camp.gallery && camp.gallery.length > 0) {
    imageFileList.value = [{
      uid: '-1',
      name: 'imagine-actuala.jpg',
      status: 'done',
      url: camp.gallery[0]
    }]
  } else {
    imageFileList.value = []
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
    maxParticipants: 0,
    gallery: []
  }
  imageFileList.value = []
  isEditing.value = false
}

const saveCamp = async () => {
  if (!campForm.value.countyId) {
    message.warning('Te rog selectează județul')
    return
  }

  try {
    // Upload image if there's a new file to upload
    let imageUrl = null
    if (imageFileList.value.length > 0) {
      const fileItem = imageFileList.value[0]
      let f: any = fileItem?.originFileObj || fileItem?.file || fileItem
      
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
        formData.append('folder', 'camps')
        
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
    
    // Get county name
    const selectedCounty = counties.value.find(c => c.id === campForm.value.countyId)
    
    // Build gallery array - use uploaded image or existing gallery
    let galleryArray = []
    if (imageUrl) {
      galleryArray = [imageUrl]
    } else if (Array.isArray(campForm.value.gallery) && campForm.value.gallery.length > 0) {
      galleryArray = [...campForm.value.gallery]
    }
    
    // Ensure countyId is always included
    if (!campForm.value.countyId) {
      message.error('Județul este obligatoriu')
      return
    }

    const data: any = {
      name: campForm.value.name,
      countyId: campForm.value.countyId,
      countyName: selectedCounty?.name || campForm.value.countyName || '',
      year: campForm.value.year,
      startDate: campForm.value.startDate ? dayjs(campForm.value.startDate).format('YYYY-MM-DD') : null,
      endDate: campForm.value.endDate ? dayjs(campForm.value.endDate).format('YYYY-MM-DD') : null,
      description: campForm.value.description || '',
      price: campForm.value.price || 0,
      maxParticipants: campForm.value.maxParticipants || 0,
      gallery: galleryArray
    }

    // Remove undefined/null fields that shouldn't be sent
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
    resetForm()
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.camp-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.camp-card :deep(.ant-card-meta) {
  flex: 1;
}

.camp-card :deep(.ant-card-actions) {
  margin-top: auto;
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
  .admin-camps :deep(.ant-upload-select) {
    width: 100% !important;
    height: auto !important;
    min-height: 80px !important;
  }
  
  .admin-camps :deep(.ant-upload-select-picture-card) {
    width: 100% !important;
    height: 80px !important;
  }
  
  .admin-camps :deep(.ant-upload-list-picture) {
    width: 100% !important;
  }
  
  .admin-camps :deep(.ant-upload-list-item) {
    width: 100% !important;
    margin-top: 16px !important;
  }
}
</style>



