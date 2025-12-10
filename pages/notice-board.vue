<template>
    <div class="notice-board-page">
      <!-- Mobile Back Button -->
      <div class="mobile-back-button">
        <a-button type="text" @click="goHome" class="back-btn">
          <ArrowLeftOutlined />
          Înapoi la pagina principală
        </a-button>
      </div>

      <div class="page-header">
        <h1>📋 Anunțuri</h1>
        <p>Ultimele actualizări, fotografii și videouri din activitățile noastre</p>
      </div>

      <div class="notices-grid">
        <a-spin :spinning="loading">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="12" :lg="8" v-for="notice in notices" :key="notice.id">
              <a-card class="notice-card" hoverable>
                <div v-if="notice.images && notice.images.length > 0" class="notice-images">
                  <img :src="notice.images[0]" :alt="notice.title" />
                </div>
                
                <a-card-meta>
                  <template #title>
                    <h3>{{ notice.title }}</h3>
                  </template>
                  <template #description>
                    <p v-if="notice.content">{{ notice.content }}</p>
                    <div v-if="notice.videos && notice.videos.length > 0" class="notice-videos">
                      <a-tag color="red">Video Disponibil</a-tag>
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const loading = ref(false)
const notices = ref<any[]>([])

const goHome = () => {
  router.push('/')
}

const loadNotices = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/notice-board')
    const data = Array.isArray(response) ? response : []
    notices.value = data.filter((notice: any) => notice.isActive)
  } catch (error) {
    console.error('Failed to load notices:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNotices()
})
</script>

<style scoped>
.notice-board-page {
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

.notices-grid {
  margin-bottom: 40px;
}

.notice-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.notice-card:hover {
  transform: translateY(-5px);
}

.notice-images {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.notice-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notice-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.notice-videos {
  margin-top: 12px;
}

.mobile-back-button {
  display: none;
}

@media (max-width: 768px) {
  .mobile-back-button {
    display: block;
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    padding: 8px 0;
    margin: -12px -12px 16px -12px;
    padding-left: 12px;
    padding-right: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .back-btn {
    width: 100%;
    text-align: left;
    padding: 8px 16px;
    font-size: 14px;
  }

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




