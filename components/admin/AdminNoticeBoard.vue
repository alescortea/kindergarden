<template>
  <div class="admin-notice-board">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Anunț
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="notice in notices" :key="notice.id">
          <a-card class="notice-card" hoverable>
            <template #cover>
              <div class="notice-image">
                <img v-if="notice.images && notice.images.length > 0" :src="notice.images[0]" :alt="notice.title" />
                <FileTextOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ notice.title }}</h3>
              </template>
              <template #description>
                <p v-if="notice.content">{{ notice.content }}</p>
                <div class="notice-tags">
                  <a-tag :color="notice.isActive ? 'green' : 'red'">
                    {{ notice.isActive ? 'Activ' : 'Inactiv' }}
                  </a-tag>
                  <a-tag v-if="notice.videos && notice.videos.length > 0" color="red">
                    Video
                  </a-tag>
                </div>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editNotice(notice)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi acest anunț?"
                @confirm="deleteNotice(notice.id)"
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
      :title="isEditing ? 'Editează Anunțul' : 'Adaugă Anunț'"
      :width="isMobile ? '95%' : 800"
      :wrap-class-name="'admin-modal-wrapper'"
      :body-style="{ maxHeight: isMobile ? '70vh' : 'none', overflowY: 'auto', padding: isMobile ? '16px' : '24px' }"
      @ok="saveNotice"
      @cancel="resetForm"
    >
      <a-form :model="noticeForm" layout="vertical">
        <a-form-item label="Titlu" required>
          <a-input v-model:value="noticeForm.title" placeholder="ex: Anunț Important" />
        </a-form-item>
        <a-form-item label="Conținut">
          <a-textarea v-model:value="noticeForm.content" :rows="4" placeholder="Conținutul anunțului" />
        </a-form-item>
        <a-form-item label="Imagini (URL-uri)">
          <a-select
            v-model:value="noticeForm.images"
            mode="tags"
            placeholder="Adaugă URL-uri pentru imagini (apasă Enter pentru a adăuga)"
            style="width: 100%"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="Videouri (URL-uri)">
          <a-select
            v-model:value="noticeForm.videos"
            mode="tags"
            placeholder="Adaugă URL-uri pentru videouri (apasă Enter pentru a adăuga)"
            style="width: 100%"
          >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="noticeForm.isActive">
            Anunț activ (va fi afișat pe site)
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed } from 'vue'

// Detect mobile device
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth <= 768
  }
  return false
})

const loading = ref(false)
const notices = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)

const noticeForm = ref<{
  id?: string
  title: string
  content?: string
  images: string[]
  videos: string[]
  isActive: boolean
}>({
  title: '',
  content: '',
  images: [],
  videos: [],
  isActive: true
})

const loadNotices = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/notice-board')
    notices.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load notices:', error)
    notices.value = []
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

const editNotice = (notice: any) => {
  isEditing.value = true
  noticeForm.value = {
    ...notice,
    images: notice.images || [],
    videos: notice.videos || []
  }
  modalVisible.value = true
}

const resetForm = () => {
  noticeForm.value = {
    id: undefined,
    title: '',
    content: '',
    images: [],
    videos: [],
    isActive: true
  }
}

const saveNotice = async () => {
  try {
    const data = {
      ...noticeForm.value
    }

    // Remove undefined fields
    delete data.id

    if (isEditing.value && noticeForm.value.id) {
      await $fetch(`/api/notice-board/${noticeForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Anunțul a fost actualizat cu succes')
    } else {
      await $fetch('/api/notice-board', {
        method: 'POST',
        body: data
      })
      message.success('Anunțul a fost adăugat cu succes')
    }

    modalVisible.value = false
    await loadNotices()
  } catch (error) {
    console.error('Failed to save notice:', error)
    message.error('Eroare la salvarea anunțului')
  }
}

const deleteNotice = async (id: string) => {
  try {
    await $fetch(`/api/notice-board/${id}`, { method: 'DELETE' })
    message.success('Anunțul a fost șters cu succes')
    await loadNotices()
  } catch (error) {
    console.error('Failed to delete notice:', error)
    message.error('Eroare la ștergerea anunțului')
  }
}

onMounted(() => {
  loadNotices()
})
</script>

<style scoped>
.admin-notice-board {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.notice-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notice-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.notice-card :deep(.ant-card-meta) {
  flex: 1;
}

.notice-card :deep(.ant-card-actions) {
  margin-top: auto;
}

.notice-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.notice-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notice-image :deep(.anticon) {
  font-size: 3rem;
}

.notice-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.notice-tags {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>



