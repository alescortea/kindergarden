<template>
    <div class="ski-page">
      <!-- Mobile Back Button -->
      <div class="mobile-back-button">
        <a-button type="text" @click="goHome" class="back-btn">
          <ArrowLeftOutlined />
          Înapoi la pagina principală
        </a-button>
      </div>

      <div class="page-header">
        <h1>⛷️ Lecții de Ski</h1>
        <p>Lecții de ski individuale și de grup pentru toate nivelurile</p>
      </div>

      <div class="filters-section">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="8" :md="6">
            <a-select
              v-model:value="filters.type"
              placeholder="Tip Lecție"
              style="width: 100%"
              @change="loadLessons"
            >
              <a-select-option value="">Toate Tipurile</a-select-option>
              <a-select-option value="individual">Individuală</a-select-option>
              <a-select-option value="group">Grup</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>

      <div class="lessons-grid">
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
                    <div class="lesson-details">
                      <p><strong>Durata:</strong> {{ lesson.duration }}</p>
                      <p><strong>Preț:</strong> {{ lesson.price }} RON</p>
                      <p v-if="lesson.maxParticipants"><strong>Participanți Maxim:</strong> {{ lesson.maxParticipants }}</p>
                    </div>
                    <p class="lesson-description">{{ lesson.description }}</p>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-button type="primary" @click="navigateToRegistration('ski', lesson.id)">
                    <FormOutlined />
                    Înscriere
                  </a-button>
                  <a-button @click="viewLessonDetails(lesson)">
                    <EyeOutlined />
                    Detalii
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </div>

      <!-- Lesson Details Modal -->
      <a-modal
        v-model:open="detailsModalVisible"
        :title="selectedLesson ? `Lecție ${getTypeLabel(selectedLesson.type)}` : ''"
        :width="800"
        :footer="null"
      >
        <div v-if="selectedLesson" class="lesson-details-modal">
          <div class="modal-image" v-if="selectedLesson.gallery && selectedLesson.gallery.length > 0">
            <img :src="selectedLesson.gallery[0]" alt="Ski Lesson" />
          </div>
          
          <div class="modal-content">
            <p class="modal-description">{{ selectedLesson.description }}</p>
            
            <div class="modal-details">
              <h4>Informații Lecție:</h4>
              <ul>
                <li><strong>Tip:</strong> {{ getTypeLabel(selectedLesson.type) }}</li>
                <li><strong>Durata:</strong> {{ selectedLesson.duration }}</li>
                <li><strong>Preț:</strong> {{ selectedLesson.price }} RON</li>
                <li v-if="selectedLesson.maxParticipants"><strong>Participanți Maxim:</strong> {{ selectedLesson.maxParticipants }}</li>
              </ul>
            </div>

            <div v-if="selectedLesson.availableDates && selectedLesson.availableDates.length > 0" class="modal-program">
              <h4>Date Disponibile:</h4>
              <ul>
                <li v-for="date in selectedLesson.availableDates" :key="date">{{ date }}</li>
              </ul>
            </div>

            <div class="modal-actions">
              <a-button type="primary" size="large" @click="navigateToRegistration('ski', selectedLesson.id)">
                <FormOutlined />
                Înscriere la Această Lecție
              </a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </template>

<script setup lang="ts">
// SEO Meta Tags
useHead({
  title: 'Lecții de Ski pentru Copii | Cursuri Ski Brașov | Roseli',
  meta: [
    { name: 'description', content: 'Lecții de ski individuale și de grup pentru copii. Cursuri de ski pentru toate nivelurile în Brașov, România.' },
    { name: 'keywords', content: 'lecții ski copii, cursuri ski copii, ski copii Brașov, lecții ski începători, ski pentru copii' },
    { property: 'og:title', content: 'Lecții de Ski pentru Copii | Roseli' },
    { property: 'og:description', content: 'Lecții de ski individuale și de grup pentru toate nivelurile' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro/ski' },
    { name: 'twitter:title', content: 'Lecții de Ski pentru Copii | Roseli' },
    { name: 'twitter:description', content: 'Lecții de ski individuale și de grup pentru toate nivelurile' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro/ski' }
  ]
})
import { TrophyOutlined, FormOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const loading = ref(false)
const lessons = ref<any[]>([])
const filters = ref({
  type: ''
})
const detailsModalVisible = ref(false)
const selectedLesson = ref<any>(null)

const goHome = () => {
  router.push('/')
}

const loadLessons = async () => {
  loading.value = true
  try {
    const query: any = {}
    if (filters.value.type && filters.value.type !== '') {
      query.type = filters.value.type
    }

    const response = await $fetch('/api/ski', { query })
    lessons.value = Array.isArray(response) ? response : []
    console.log('Loaded ski lessons:', lessons.value.length, 'with filters:', query)
  } catch (error) {
    console.error('Failed to load ski lessons:', error)
    lessons.value = []
  } finally {
    loading.value = false
  }
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'individual': 'Individuală',
    'group': 'Grup'
  }
  return labels[type?.toLowerCase()] || 'Nespecificat'
}

const viewLessonDetails = (lesson: any) => {
  selectedLesson.value = lesson
  detailsModalVisible.value = true
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
.ski-page {
  min-height: 100vh;
  position: relative;
}

.mobile-back-button {
  display: none;
  margin-bottom: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 500;
}

.back-btn:hover {
  color: #764ba2;
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

.lesson-details-modal {
  text-align: center;
}

.modal-image {
  margin-bottom: 24px;
}

.modal-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.modal-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 24px;
  color: #666;
}

.modal-details h4,
.modal-program h4 {
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
}

.modal-details ul {
  text-align: left;
  margin-bottom: 24px;
}

.modal-details li {
  margin-bottom: 8px;
  color: #666;
}

.modal-program ul {
  text-align: left;
  margin-bottom: 24px;
}

.modal-program li {
  margin-bottom: 8px;
  color: #666;
}

.modal-actions {
  margin-top: 24px;
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




