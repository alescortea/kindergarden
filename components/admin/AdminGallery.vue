<template>
  <div class="admin-gallery">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Imagini în Galerie
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]">
        <a-col :xs="12" :sm="8" :md="6" v-for="item in galleryItems" :key="item.id">
          <a-card class="gallery-card" hoverable>
            <template #cover>
              <div class="gallery-item-image">
                <img v-if="item.images && item.images.length > 0" :src="item.images[0]" :alt="item.title || 'Imagine galerie'" />
                <PictureOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ item.title || 'Fără titlu' }}</h3>
              </template>
              <template #description>
                <p><strong>Tip Activitate:</strong> {{ getActivityTypeLabel(item.activityType) }}</p>
                <p><strong>Imagini:</strong> {{ item.images?.length || 0 }}</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editItem(item)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi acest element din galerie?"
                @confirm="deleteItem(item.id)"
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
      :title="isEditing ? 'Editează Element Galerie' : 'Adaugă Imagini în Galerie'"
      :width="800"
      @ok="saveItem"
      @cancel="resetForm"
    >
      <a-form :model="galleryForm" layout="vertical">
        <a-form-item label="Tip Activitate" required>
          <a-select v-model:value="galleryForm.activityType" placeholder="Selectează tipul activității">
            <a-select-option value="camp">Tabere</a-select-option>
            <a-select-option value="hike">Drumeții</a-select-option>
            <a-select-option value="trip">Excursii</a-select-option>
            <a-select-option value="ski">Lecții de Ski</a-select-option>
            <a-select-option value="swimming">Lecții de Înot</a-select-option>
            <a-select-option value="afterschool">Afterschool</a-select-option>
            <a-select-option value="general">General</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="Titlu (opțional)">
          <a-input v-model:value="galleryForm.title" placeholder="ex: Tabere de vară 2024" />
        </a-form-item>

        <a-form-item label="Imagini" required>
          <a-upload
            v-model:file-list="imageFileList"
            :before-upload="beforeUpload"
            :custom-request="handleImageUpload"
            list-type="picture-card"
            :max-count="20"
            accept="image/*"
            multiple
          >
            <div v-if="imageFileList.length < 20">
              <PlusOutlined />
              <div style="margin-top: 8px">Încarcă</div>
            </div>
          </a-upload>
          <p style="color: #999; margin-top: 8px; font-size: 12px;">
            Poți încărca până la 20 de imagini. Formate acceptate: JPG, PNG, GIF.
          </p>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons-vue'
import type { UploadFile, UploadProps } from 'ant-design-vue'

const loading = ref(false)
const galleryItems = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)
const imageFileList = ref<UploadFile[]>([])
const uploading = ref(false)

const galleryForm = ref({
  id: undefined as string | undefined,
  activityType: 'general' as 'camp' | 'hike' | 'trip' | 'ski' | 'swimming' | 'afterschool' | 'general',
  activityId: undefined as string | undefined,
  title: '',
  images: [] as string[]
})

const loadGallery = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/gallery')
    galleryItems.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load gallery:', error)
    message.error('Eroare la încărcarea galeriei')
  } finally {
    loading.value = false
  }
}

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'camp': 'Tabere',
    'hike': 'Drumeții',
    'trip': 'Excursii',
    'ski': 'Lecții de Ski',
    'swimming': 'Lecții de Înot',
    'afterschool': 'Afterschool',
    'general': 'General'
  }
  return labels[type] || 'Nespecificat'
}

const showAddModal = () => {
  isEditing.value = false
  resetForm()
  modalVisible.value = true
}

const editItem = (item: any) => {
  isEditing.value = true
  galleryForm.value = {
    id: item.id,
    activityType: item.activityType || 'general',
    activityId: item.activityId,
    title: item.title || '',
    images: Array.isArray(item.images) ? [...item.images] : []
  }
  
  // Setează file list pentru imaginile existente
  if (item.images && item.images.length > 0) {
    imageFileList.value = item.images.map((url: string, index: number) => ({
      uid: `-${index}`,
      name: `imagine-${index}.jpg`,
      status: 'done',
      url: url
    }))
  } else {
    imageFileList.value = []
  }
  modalVisible.value = true
}

const resetForm = () => {
  galleryForm.value = {
    id: undefined,
    activityType: 'general',
    activityId: undefined,
    title: '',
    images: []
  }
  imageFileList.value = []
  isEditing.value = false
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type?.startsWith('image/')
  if (!isImage) {
    message.error('Poți încărca doar imagini!')
    return false
  }
  const isLt10M = file.size! / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('Imaginea trebuie să fie mai mică de 10MB!')
    return false
  }
  return false // Prevent default upload
}

const handleImageUpload = (options: any) => {
  const { file } = options
  // Just store the file in imageFileList, actual upload happens on save
  const newFile: UploadFile = {
    uid: file.uid,
    name: file.name,
    status: 'done',
    url: URL.createObjectURL(file), // For local preview
    originFileObj: file // Store the actual file object
  }
  imageFileList.value.push(newFile)
  message.success('Imaginea a fost selectată! Va fi încărcată la salvare.')
  return false // Prevent default upload behavior
}

const saveItem = async () => {
  if (!galleryForm.value.activityType) {
    message.warning('Te rog selectează tipul activității')
    return
  }

  if (imageFileList.value.length === 0) {
    message.warning('Te rog adaugă cel puțin o imagine')
    return
  }

  uploading.value = true
  try {
    // Upload all new images
    const imageUrls: string[] = []
    
    // First, collect existing image URLs (from items that don't have originFileObj)
    const existingImages = imageFileList.value
      .filter(file => !file.originFileObj && file.url)
      .map(file => file.url as string)
    
    imageUrls.push(...existingImages)
    
    // Upload new images
    for (const fileItem of imageFileList.value) {
      if (fileItem.originFileObj) {
        const file = fileItem.originFileObj
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'gallery')
        
        const uploadResponse = await $fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.uploads && uploadResponse.uploads.length > 0) {
          imageUrls.push(uploadResponse.uploads[0].url)
        }
      }
    }

    if (imageUrls.length === 0) {
      message.error('Eroare: Nu s-au încărcat imagini.')
      uploading.value = false
      return
    }

    const data = {
      activityType: galleryForm.value.activityType,
      activityId: galleryForm.value.activityId,
      title: galleryForm.value.title || undefined,
      images: imageUrls
    }

    if (isEditing.value && galleryForm.value.id) {
      // Update existing item
      await $fetch(`/api/gallery/${galleryForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Elementul din galerie a fost actualizat cu succes!')
    } else {
      // Create new item
      await $fetch('/api/gallery', {
        method: 'POST',
        body: data
      })
      message.success('Imaginile au fost adăugate în galerie cu succes!')
    }

    modalVisible.value = false
    resetForm()
    await loadGallery()
  } catch (error: any) {
    console.error('Failed to save gallery item:', error)
    message.error(error?.data?.message || 'Eroare la salvarea elementului din galerie')
  } finally {
    uploading.value = false
  }
}

const deleteItem = async (id: string) => {
  try {
    await $fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    message.success('Elementul a fost șters cu succes!')
    await loadGallery()
  } catch (error) {
    console.error('Failed to delete item:', error)
    message.error('Eroare la ștergerea elementului')
  }
}

onMounted(() => {
  loadGallery()
})
</script>

<style scoped>
.admin-gallery {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.gallery-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.gallery-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.gallery-card :deep(.ant-card-meta) {
  flex: 1;
}

.gallery-item-image {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  overflow: hidden;
}

.gallery-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item-image :deep(.anticon) {
  font-size: 48px;
  color: #999;
}

/* Ensure all cards have the same height */
.gallery-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.gallery-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.gallery-card :deep(.ant-card-meta) {
  flex: 1;
}
</style>
