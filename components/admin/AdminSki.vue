<template>
  <div class="admin-ski">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Lecție de Ski
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="lesson in lessons" :key="lesson.id">
          <a-card class="lesson-card" hoverable>
            <template #cover>
              <div class="lesson-image">
                <img v-if="lesson.gallery && lesson.gallery.length > 0" :src="lesson.gallery[0]" alt="Ski Lesson" />
                <TrophyOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>Lecție {{ getTypeLabel(lesson.type) }}</h3>
              </template>
              <template #description>
                <p><strong>Județ:</strong> {{ getLocationDisplay(lesson) }}</p>
                <p><strong>Durata:</strong> {{ lesson.duration }}</p>
                <p><strong>Preț:</strong> {{ lesson.price }} RON</p>
                <p v-if="lesson.maxParticipants"><strong>Participanți Maxim:</strong> {{ lesson.maxParticipants }}</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editLesson(lesson)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi această lecție?"
                @confirm="deleteLesson(lesson.id)"
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
      :title="isEditing ? 'Editează Lecție de Ski' : 'Adaugă Lecție de Ski'"
      :width="800"
      @ok="saveLesson"
      @cancel="resetForm"
    >
      <a-form :model="lessonForm" layout="vertical">
        <a-form-item label="Tip Lecție" required>
          <a-select v-model:value="lessonForm.type" placeholder="Selectează tipul lecției">
            <a-select-option value="individual">Individuală</a-select-option>
            <a-select-option value="group">Grup</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Județ" required>
          <a-select 
            v-model:value="lessonForm.countyId" 
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
            <a-form-item label="Durata" required>
              <a-input v-model:value="lessonForm.duration" placeholder="ex: 1 oră, 2 ore" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Preț (RON)" required>
              <a-input-number v-model:value="lessonForm.price" style="width: 100%" :min="0" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Participanți Maxim" v-if="lessonForm.type === 'group'">
          <a-input-number v-model:value="lessonForm.maxParticipants" style="width: 100%" :min="1" />
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
          <div v-if="lessonForm.gallery && lessonForm.gallery.length > 0" style="margin-top: 16px;">
            <p style="margin-bottom: 8px; color: #666;">Imagine actuală:</p>
            <img :src="lessonForm.gallery[0]" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #d9d9d9;" />
          </div>
        </a-form-item>
        <a-form-item label="Descriere" required>
          <a-textarea v-model:value="lessonForm.description" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'

const loading = ref(false)
const lessons = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)
const counties = ref<any[]>([])
const loadingCounties = ref(false)

const lessonForm = ref<{
  id?: string
  type: string
  duration: string
  price: number
  description: string
  maxParticipants?: number
  countyId?: string
  countyName?: string
  gallery?: string[]
  videos?: string[]
  availableDates?: string[]
}>({
  type: 'individual',
  duration: '',
  price: 0,
  description: '',
  maxParticipants: undefined,
  countyId: '',
  countyName: '',
  gallery: [],
  videos: [],
  availableDates: []
})

const imageFileList = ref<any[]>([])
const uploading = ref(false)

const beforeUpload: UploadProps['beforeUpload'] = (file: File) => {
  const isImage = file.type.startsWith('image/')
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
  
  try {
    // Nu facem upload acum, doar păstrăm fișierul pentru upload la salvare
    imageFileList.value = [{
      uid: '-1',
      name: file.name,
      status: 'uploading',
      originFileObj: file // Păstrăm fișierul original pentru upload la salvare
    }]
    
    message.success('Imaginea a fost selectată! Va fi încărcată la salvare.')
    console.log('Image selected for upload:', file.name)
  } catch (error) {
    console.error('Error selecting image:', error)
    message.error('Eroare la selectarea imaginii')
    imageFileList.value = []
  }
}

const loadLessons = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/ski')
    lessons.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load ski lessons:', error)
    lessons.value = []
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
  lessonForm.value.countyId = countyId
  const county = counties.value.find(c => c.id === countyId)
  lessonForm.value.countyName = county?.name || ''
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'individual': 'Individuală',
    'group': 'Grup'
  }
  return labels[type?.toLowerCase()] || 'Nespecificat'
}

const getLocationDisplay = (lesson: any) => {
  if (lesson.countyName) {
    return lesson.countyName
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

const editLesson = (lesson: any) => {
  isEditing.value = true
  lessonForm.value = {
    ...lesson
  }
  // Setează file list pentru imaginea existentă
  if (lesson.gallery && lesson.gallery.length > 0) {
    imageFileList.value = [{
      uid: '-1',
      name: 'imagine-actuala.jpg',
      status: 'done',
      url: lesson.gallery[0]
    }]
  } else {
    imageFileList.value = []
  }
  modalVisible.value = true
}

const resetForm = () => {
  lessonForm.value = {
    id: undefined,
    type: 'individual',
    duration: '',
    price: 0,
    description: '',
    maxParticipants: undefined,
    countyId: '',
    countyName: '',
    gallery: [],
    videos: [],
    availableDates: []
  }
  imageFileList.value = []
  isEditing.value = false
}

const saveLesson = async () => {
  if (!lessonForm.value.countyId) {
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
      formData.append('folder', 'ski')
      
      const uploadResponse = await $fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (uploadResponse.uploads && uploadResponse.uploads.length > 0) {
        imageUrl = uploadResponse.uploads[0].url
        console.log('Image uploaded during save, URL:', imageUrl)
      }
    }
    
    // Get county name
    const selectedCounty = counties.value.find(c => c.id === lessonForm.value.countyId)
    
    // Build gallery array - use uploaded image or existing gallery
    let galleryArray = []
    if (imageUrl) {
      // New image uploaded
      galleryArray = [imageUrl]
    } else if (Array.isArray(lessonForm.value.gallery) && lessonForm.value.gallery.length > 0) {
      // Use existing gallery
      galleryArray = [...lessonForm.value.gallery]
    }
    
    // Convert reactive arrays to plain arrays
    const videosArray = Array.isArray(lessonForm.value.videos) 
      ? [...lessonForm.value.videos] 
      : []
    const availableDatesArray = Array.isArray(lessonForm.value.availableDates) 
      ? [...lessonForm.value.availableDates] 
      : []
    
    const data = {
      type: lessonForm.value.type,
      duration: lessonForm.value.duration,
      price: lessonForm.value.price,
      description: lessonForm.value.description,
      maxParticipants: lessonForm.value.maxParticipants,
      countyId: lessonForm.value.countyId,
      countyName: selectedCounty?.name || lessonForm.value.countyName || '',
      gallery: galleryArray,
      videos: videosArray,
      availableDates: availableDatesArray
    }

    // Debug: log data before sending
    console.log('Saving lesson with data:', data)
    console.log('Gallery array:', galleryArray)

    if (isEditing.value && lessonForm.value.id) {
      await $fetch(`/api/ski/${lessonForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Lecția a fost actualizată cu succes')
    } else {
      await $fetch('/api/ski', {
        method: 'POST',
        body: data
      })
      message.success('Lecția a fost adăugată cu succes')
    }

    modalVisible.value = false
    await loadLessons()
  } catch (error) {
    console.error('Failed to save lesson:', error)
    message.error('Eroare la salvarea lecției')
  }
}

const deleteLesson = async (id: string) => {
  try {
    await $fetch(`/api/ski/${id}`, { method: 'DELETE' })
    message.success('Lecția a fost ștearsă cu succes')
    await loadLessons()
  } catch (error) {
    console.error('Failed to delete lesson:', error)
    message.error('Eroare la ștergerea lecției')
  }
}

onMounted(() => {
  loadLessons()
  loadCounties()
})
</script>

<style scoped>
.admin-ski {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.lesson-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.lesson-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.lesson-card :deep(.ant-card-meta) {
  flex: 1;
}

.lesson-card :deep(.ant-card-actions) {
  margin-top: auto;
}

.lesson-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.lesson-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lesson-image :deep(.anticon) {
  font-size: 3rem;
}

.lesson-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}
</style>



