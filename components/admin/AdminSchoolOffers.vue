<template>
  <div class="admin-school-offers">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Ofertă Școlară
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="offer in offers" :key="offer.id">
          <a-card class="offer-card" hoverable>
            <template #cover>
              <div class="offer-image">
                <img v-if="offer.gallery && offer.gallery.length > 0" :src="offer.gallery[0]" :alt="offer.title" />
                <BookOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ offer.title }}</h3>
              </template>
              <template #description>
                <p v-if="offer.price && !offer.customPrice"><strong>Preț:</strong> {{ offer.price }} RON</p>
                <p v-else-if="offer.customPrice"><strong>Preț:</strong> Personalizat</p>
                <p v-if="offer.maxParticipants"><strong>Participanți Maxim:</strong> {{ offer.maxParticipants }}</p>
                <p><strong>Transport:</strong> {{ offer.transportIncluded ? 'Inclus' : 'Neinclus' }}</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editOffer(offer)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi această ofertă?"
                @confirm="deleteOffer(offer.id)"
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
      :title="isEditing ? 'Editează Oferta Școlară' : 'Adaugă Ofertă Școlară'"
      :width="isMobile ? '95%' : 800"
      :wrap-class-name="'admin-modal-wrapper'"
      :body-style="{ maxHeight: isMobile ? '70vh' : 'none', overflowY: 'auto', padding: isMobile ? '16px' : '24px' }"
      @ok="saveOffer"
      @cancel="resetForm"
    >
      <a-form :model="offerForm" layout="vertical">
        <a-form-item label="Titlu" required>
          <a-input v-model:value="offerForm.title" placeholder="ex: Excursie Școlară la București" />
        </a-form-item>
        <a-form-item label="Descriere" required>
          <a-textarea v-model:value="offerForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Activități" required>
          <a-select
            v-model:value="offerForm.activities"
            mode="tags"
            placeholder="Adaugă activități (apasă Enter pentru a adăuga)"
            style="width: 100%"
          >
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Preț (RON)" v-if="!offerForm.customPrice">
              <a-input-number v-model:value="offerForm.price" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item>
              <a-checkbox v-model:checked="offerForm.customPrice">
                Preț personalizat
              </a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Participanți Maxim">
              <a-input-number v-model:value="offerForm.maxParticipants" style="width: 100%" :min="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-checkbox v-model:checked="offerForm.transportIncluded">
            Transport inclus
          </a-checkbox>
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
          <div v-if="offerForm.gallery && offerForm.gallery.length > 0" style="margin-top: 16px;">
            <p style="margin-bottom: 8px; color: #666;">Imagine actuală:</p>
            <img :src="offerForm.gallery[0]" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #d9d9d9;" />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { computed } from 'vue'
import { compressImage } from '~/composables/useImageCompression'

const loading = ref(false)
const offers = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)

const offerForm = ref<{
  id?: string
  title: string
  description: string
  activities: string[]
  price?: number
  customPrice: boolean
  transportIncluded: boolean
  maxParticipants?: number
  gallery?: string[]
  videos?: string[]
}>({
  title: '',
  description: '',
  activities: [],
  price: undefined,
  customPrice: false,
  transportIncluded: true,
  maxParticipants: undefined,
  gallery: [],
  videos: []
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

const loadOffers = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/school-offers')
    offers.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load school offers:', error)
    offers.value = []
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  console.log('showAddModal called')
  isEditing.value = false
  resetForm()
  modalVisible.value = true
  console.log('modalVisible set to:', modalVisible.value)
}

const editOffer = (offer: any) => {
  isEditing.value = true
  offerForm.value = {
    ...offer
  }
  // Setează file list pentru imaginea existentă
  if (offer.gallery && offer.gallery.length > 0) {
    imageFileList.value = [{
      uid: '-1',
      name: 'imagine-actuala.jpg',
      status: 'done',
      url: offer.gallery[0]
    }]
  } else {
    imageFileList.value = []
  }
  modalVisible.value = true
}

const resetForm = () => {
  offerForm.value = {
    id: undefined,
    title: '',
    description: '',
    activities: [],
    price: undefined,
    customPrice: false,
    transportIncluded: true,
    maxParticipants: undefined,
    gallery: [],
    videos: []
  }
  imageFileList.value = []
  isEditing.value = false
}

const saveOffer = async () => {
  if (!offerForm.value.activities || offerForm.value.activities.length === 0) {
    message.warning('Te rog adaugă cel puțin o activitate')
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
        formData.append('folder', 'school-offers')
        
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
    
    // Build gallery array - use uploaded image or existing gallery
    let galleryArray = []
    if (imageUrl) {
      galleryArray = [imageUrl]
    } else if (Array.isArray(offerForm.value.gallery) && offerForm.value.gallery.length > 0) {
      galleryArray = [...offerForm.value.gallery]
    }
    
    const data = {
      ...offerForm.value,
      gallery: galleryArray
    }

    // Remove undefined fields
    delete data.id

    // If customPrice is true, remove price
    if (data.customPrice) {
      delete data.price
    } else if (!data.price) {
      message.warning('Te rog introdu prețul sau bifează "Preț personalizat"')
      return
    }

    if (isEditing.value && offerForm.value.id) {
      await $fetch(`/api/school-offers/${offerForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Oferta a fost actualizată cu succes')
    } else {
      await $fetch('/api/school-offers', {
        method: 'POST',
        body: data
      })
      message.success('Oferta a fost adăugată cu succes')
    }

    modalVisible.value = false
    await loadOffers()
  } catch (error) {
    console.error('Failed to save offer:', error)
    message.error('Eroare la salvarea ofertei')
  }
}

const deleteOffer = async (id: string) => {
  try {
    await $fetch(`/api/school-offers/${id}`, { method: 'DELETE' })
    message.success('Oferta a fost ștearsă cu succes')
    await loadOffers()
  } catch (error) {
    console.error('Failed to delete offer:', error)
    message.error('Eroare la ștergerea ofertei')
  }
}

onMounted(() => {
  loadOffers()
})
</script>

<style scoped>
.admin-school-offers {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.offer-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.offer-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.offer-card :deep(.ant-card-meta) {
  flex: 1;
}

.offer-card :deep(.ant-card-actions) {
  margin-top: auto;
}

.offer-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.offer-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.offer-image :deep(.anticon) {
  font-size: 3rem;
}

.offer-card h3 {
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
  .admin-school-offers :deep(.ant-upload-select) {
    width: 100% !important;
    height: auto !important;
    min-height: 80px !important;
  }
  
  .admin-school-offers :deep(.ant-upload-select-picture-card) {
    width: 100% !important;
    height: 80px !important;
  }
  
  .admin-school-offers :deep(.ant-upload-list-picture) {
    width: 100% !important;
  }
  
  .admin-school-offers :deep(.ant-upload-list-item) {
    width: 100% !important;
    margin-top: 16px !important;
  }
}
</style>



