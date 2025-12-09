<template>
    <div class="swimming-page">
      <div class="page-header">
        <h1>🏊 Swimming Lessons</h1>
        <p>Swimming lessons at Paradisul Acvatic location</p>
      </div>

      <div class="lessons-grid">
        <a-spin :spinning="loading">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="12" :lg="8" v-for="lesson in lessons" :key="lesson.id">
              <a-card class="lesson-card" hoverable>
                <template #cover>
                  <div class="lesson-image">
                    <img v-if="lesson.gallery && lesson.gallery.length > 0" :src="lesson.gallery[0]" alt="Swimming Lesson" />
                    <PlayCircleOutlined v-else />
                  </div>
                </template>
                
                <a-card-meta>
                  <template #title>
                    <h3>{{ getTypeLabel(lesson.type) }} Lesson</h3>
                  </template>
                  <template #description>
                    <div class="lesson-details">
                      <p><strong>Location:</strong> {{ lesson.location }}</p>
                      <p><strong>Duration:</strong> {{ lesson.duration }}</p>
                      <p><strong>Price:</strong> {{ lesson.price }} RON</p>
                      <p v-if="lesson.maxParticipants"><strong>Max Participants:</strong> {{ lesson.maxParticipants }}</p>
                    </div>
                    <p class="lesson-description">{{ lesson.description }}</p>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-button type="primary" @click="navigateToRegistration('swimming', lesson.id)">
                    <FormOutlined />
                    Register
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { PlayCircleOutlined, FormOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const loading = ref(false)
const lessons = ref<any[]>([])

const loadLessons = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/swimming')
    lessons.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load swimming lessons:', error)
  } finally {
    loading.value = false
  }
}

const getTypeLabel = (type: string) => {
  return type === 'individual' ? 'Individual' : 'Group'
}

const navigateToRegistration = (activityType: string, activityId: string) => {
  router.push({
    path: '/registration',
    query: { activityType, activityId }
  })
}

onMounted(() => {
  loadLessons()
})
</script>

<style scoped>
.swimming-page {
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

.lessons-grid {
  margin-bottom: 40px;
}

.lesson-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.lesson-card:hover {
  transform: translateY(-5px);
}

.lesson-image {
  height: 200px;
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
  font-size: 4rem;
}

.lesson-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.lesson-details p {
  margin-bottom: 8px;
  color: #666;
}

.lesson-description {
  margin-top: 12px;
  color: #666;
  line-height: 1.6;
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




