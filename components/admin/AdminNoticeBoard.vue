<template>
  <div class="admin-notice-board">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Add Notice
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="notice in notices" :key="notice.id">
          <a-card class="notice-card" hoverable>
            <div v-if="notice.images && notice.images.length > 0" class="notice-image">
              <img :src="notice.images[0]" :alt="notice.title" />
            </div>
            <a-card-meta>
              <template #title>
                <h3>{{ notice.title }}</h3>
              </template>
              <template #description>
                <p>{{ notice.content }}</p>
                <a-tag :color="notice.isActive ? 'green' : 'red'">
                  {{ notice.isActive ? 'Active' : 'Inactive' }}
                </a-tag>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editNotice(notice)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Are you sure you want to delete this notice?"
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
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const notices = ref<any[]>([])

const loadNotices = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/notice-board')
    notices.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load notices:', error)
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  // Implement add modal with file upload for images/videos
}

const editNotice = (notice: any) => {
  // Implement edit modal
}

const deleteNotice = async (id: string) => {
  try {
    await $fetch(`/api/notice-board/${id}`, { method: 'DELETE' })
    await loadNotices()
  } catch (error) {
    console.error('Failed to delete notice:', error)
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

.notice-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.notice-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>



