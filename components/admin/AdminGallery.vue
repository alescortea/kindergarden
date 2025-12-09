<template>
  <div class="admin-gallery">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Add Gallery Item
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]">
        <a-col :xs="12" :sm="8" :md="6" v-for="item in galleryItems" :key="item.id">
          <div class="gallery-item">
            <img v-if="item.images && item.images.length > 0" :src="item.images[0]" :alt="item.title" />
            <div class="gallery-actions">
              <a-button size="small" @click="editItem(item)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Are you sure you want to delete this item?"
                @confirm="deleteItem(item.id)"
              >
                <a-button size="small" danger>
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const galleryItems = ref<any[]>([])

const loadGallery = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/gallery')
    galleryItems.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load gallery:', error)
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  // Implement add modal with file upload
}

const editItem = (item: any) => {
  // Implement edit modal
}

const deleteItem = async (id: string) => {
  try {
    await $fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    await loadGallery()
  } catch (error) {
    console.error('Failed to delete item:', error)
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

.gallery-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gallery-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  display: flex;
  gap: 8px;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-actions {
  opacity: 1;
}
</style>



