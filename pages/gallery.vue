<template>
    <div class="gallery-page">
      <div class="page-header">
        <h1>📸 Gallery</h1>
        <p>Photos and videos from our activities</p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="8" :md="6">
            <a-select
              v-model:value="filters.activityType"
              placeholder="Activity Type"
              style="width: 100%"
              @change="loadGallery"
            >
              <a-select-option value="">All Activities</a-select-option>
              <a-select-option value="camp">Camps</a-select-option>
              <a-select-option value="hike">Hikes</a-select-option>
              <a-select-option value="trip">Trips</a-select-option>
              <a-select-option value="ski">Ski</a-select-option>
              <a-select-option value="swimming">Swimming</a-select-option>
              <a-select-option value="afterschool">Afterschool</a-select-option>
              <a-select-option value="general">General</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>

      <!-- Gallery Grid -->
      <div class="gallery-grid">
        <a-spin :spinning="loading">
          <div v-if="galleryItems.length === 0" class="empty-state">
            <PictureOutlined />
            <p>No gallery items found</p>
          </div>
          <a-row :gutter="[16, 16]" v-else>
            <a-col :xs="12" :sm="8" :md="6" v-for="item in galleryItems" :key="item.id">
              <div class="gallery-item" @click="viewImage(item)">
                <img v-if="item.images && item.images.length > 0" :src="item.images[0]" :alt="item.title || 'Gallery Image'" />
                <div class="gallery-overlay">
                  <EyeOutlined />
                </div>
              </div>
            </a-col>
          </a-row>
        </a-spin>
      </div>

      <!-- Image Viewer Modal -->
      <a-modal
        v-model:open="imageViewerVisible"
        :footer="null"
        :width="900"
        centered
      >
        <div v-if="selectedItem" class="image-viewer">
          <div class="viewer-main-image">
            <img :src="currentImage" :alt="selectedItem.title || 'Gallery Image'" />
          </div>
          <div v-if="selectedItem.images && selectedItem.images.length > 1" class="viewer-thumbnails">
            <img
              v-for="(img, index) in selectedItem.images"
              :key="index"
              :src="img"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
            />
          </div>
        </div>
      </a-modal>
    </div>
  </template>

<script setup lang="ts">
// SEO Meta Tags
useHead({
  title: 'Galerie Foto | Imagini din Activități | Roseli',
  meta: [
    { name: 'description', content: 'Galerie foto și video cu imagini din activitățile noastre: tabere, drumeții, excursii, lecții de ski și înot pentru copii.' },
    { name: 'keywords', content: 'galerie foto copii, imagini activități copii, fotografii tabere, imagini drumeții, galerie Roseli' },
    { property: 'og:title', content: 'Galerie Foto | Roseli' },
    { property: 'og:description', content: 'Galerie foto și video cu imagini din activitățile noastre' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro/gallery' },
    { name: 'twitter:title', content: 'Galerie Foto | Roseli' },
    { name: 'twitter:description', content: 'Galerie foto și video cu imagini din activitățile noastre' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro/gallery' }
  ]
})
import { PictureOutlined, EyeOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const galleryItems = ref<any[]>([])
const filters = ref({
  activityType: ''
})
const imageViewerVisible = ref(false)
const selectedItem = ref<any>(null)
const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (!selectedItem.value || !selectedItem.value.images) return ''
  return selectedItem.value.images[currentImageIndex.value] || selectedItem.value.images[0]
})

const loadGallery = async () => {
  loading.value = true
  try {
    const query: any = {}
    if (filters.value.activityType) query.activityType = filters.value.activityType

    const response = await $fetch('/api/gallery', { query })
    galleryItems.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load gallery:', error)
  } finally {
    loading.value = false
  }
}

const viewImage = (item: any) => {
  selectedItem.value = item
  currentImageIndex.value = 0
  imageViewerVisible.value = true
}

onMounted(() => {
  loadGallery()
})
</script>

<style scoped>
.gallery-page {
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  margin: 0 -24px 40px -24px;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.filters-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.gallery-grid {
  margin-bottom: 40px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state :deep(.anticon) {
  font-size: 4rem;
  margin-bottom: 16px;
}

.gallery-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-overlay :deep(.anticon) {
  font-size: 2rem;
  color: white;
}

.image-viewer {
  text-align: center;
}

.viewer-main-image {
  margin-bottom: 20px;
}

.viewer-main-image img {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
}

.viewer-thumbnails {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.viewer-thumbnails img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.viewer-thumbnails img.active {
  border-color: #667eea;
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 20px;
    margin: 0 -16px 30px -16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .page-header p {
    font-size: 1rem;
  }
}
</style>




