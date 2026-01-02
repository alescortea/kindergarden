<template>
    <div class="hikes-page">
      <!-- Mobile Back Button -->
      <div class="mobile-back-button">
        <a-button type="text" @click="goHome" class="back-btn">
          <ArrowLeftOutlined />
          Înapoi la pagina principală
        </a-button>
      </div>

      <div class="page-header">
        <h1>🥾 Drumeții & Aventuri</h1>
        <p>Descoperă natura prin drumeții captivante în Munții Carpați</p>
      </div>

      <div class="hikes-grid">
        <a-spin :spinning="loading">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="12" :lg="8" v-for="hike in hikes" :key="hike.id">
              <a-card class="hike-card" hoverable>
                <template #cover>
                  <div class="hike-image">
                    <img v-if="hike.gallery && hike.gallery.length > 0" :src="hike.gallery[0]" :alt="hike.name" />
                    <EnvironmentOutlined v-else />
                  </div>
                </template>
                
                <a-card-meta>
                  <template #title>
                    <h3>{{ hike.name }}</h3>
                  </template>
                  <template #description>
                    <div class="hike-details">
                      <p><strong>Locația:</strong> {{ hike.location }}</p>
                      <p><strong>Dificultate:</strong> {{ getDifficultyLabel(hike.difficulty) }}</p>
                      <p><strong>Durata:</strong> {{ hike.duration }}</p>
                      <p v-if="hike.distance"><strong>Distanță:</strong> {{ hike.distance }}</p>
                      <p><strong>Preț:</strong> {{ hike.price }} RON</p>
                    </div>
                    <p class="hike-description">{{ hike.description }}</p>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-button type="primary" @click="navigateToRegistration('hike', hike.id)">
                    <FormOutlined />
                    Înscriere
                  </a-button>
                  <a-button @click="viewHikeDetails(hike)">
                    <EyeOutlined />
                    Detalii
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </div>

      <!-- Hike Details Modal -->
      <a-modal
        v-model:open="detailsModalVisible"
        :title="selectedHike?.name"
        :width="800"
        :footer="null"
      >
        <div v-if="selectedHike" class="hike-details-modal">
          <div class="modal-image" v-if="selectedHike.gallery && selectedHike.gallery.length > 0">
            <img :src="selectedHike.gallery[0]" :alt="selectedHike.name" />
          </div>
          
          <div class="modal-content">
            <p class="modal-description">{{ selectedHike.description }}</p>
            
            <div class="modal-details">
              <h4>Informații Drumeție:</h4>
              <ul>
                <li><strong>Locația:</strong> {{ selectedHike.location }}</li>
                <li><strong>Dificultate:</strong> {{ getDifficultyLabel(selectedHike.difficulty) }}</li>
                <li><strong>Durata:</strong> {{ selectedHike.duration }}</li>
                <li v-if="selectedHike.distance"><strong>Distanță:</strong> {{ selectedHike.distance }}</li>
                <li v-if="selectedHike.elevation"><strong>Altitudine:</strong> {{ selectedHike.elevation }}</li>
                <li><strong>Preț:</strong> {{ selectedHike.price }} RON</li>
                <li v-if="selectedHike.meetingPoint"><strong>Punct de Întâlnire:</strong> {{ selectedHike.meetingPoint }}</li>
              </ul>
            </div>

            <div v-if="selectedHike.program" class="modal-program">
              <h4>Program:</h4>
              <p>{{ selectedHike.program }}</p>
            </div>

            <div class="modal-actions">
              <a-button type="primary" size="large" @click="navigateToRegistration('hike', selectedHike.id)">
                <FormOutlined />
                Înscriere la Această Drumeție
              </a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </template>

<script setup lang="ts">
import { EnvironmentOutlined, FormOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'

// SEO Meta Tags
useHead({
  title: 'Drumeții pentru Copii | Aventuri Montane | Roseli',
  meta: [
    { name: 'description', content: 'Drumeții montane și de aventură pentru copii în Munții Carpați. Descoperă natura prin drumeții captivante adaptate pentru copii.' },
    { name: 'keywords', content: 'drumeții copii, drumeții montane copii, aventuri copii, drumeții Carpați, activități outdoor copii' },
    { property: 'og:title', content: 'Drumeții pentru Copii | Roseli' },
    { property: 'og:description', content: 'Drumeții montane și de aventură pentru copii în Munții Carpați' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro/hikes' },
    { name: 'twitter:title', content: 'Drumeții pentru Copii | Roseli' },
    { name: 'twitter:description', content: 'Drumeții montane și de aventură pentru copii în Munții Carpați' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro/hikes' }
  ]
})

const router = useRouter()

const loading = ref(false)
const hikes = ref<any[]>([])
const detailsModalVisible = ref(false)
const selectedHike = ref<any>(null)

const goHome = () => {
  router.push('/')
}

const loadHikes = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/hikes')
    hikes.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load hikes:', error)
  } finally {
    loading.value = false
  }
}

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    'easy': 'Ușor',
    'medium': 'Mediu',
    'hard': 'Greu'
  }
  return labels[difficulty?.toLowerCase()] || 'Nespecificat'
}

const viewHikeDetails = (hike: any) => {
  selectedHike.value = hike
  detailsModalVisible.value = true
}

const navigateToRegistration = (activityType: string, activityId: string) => {
  router.push({
    path: '/registration',
    query: { activityType, activityId }
  })
}

onMounted(() => {
  loadHikes()
})
</script>

<style scoped>
.hikes-page {
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

.hikes-grid {
  margin-bottom: 40px;
}

.hike-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.hike-card:hover {
  transform: translateY(-5px);
}

.hike-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.hike-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hike-image :deep(.anticon) {
  font-size: 4rem;
}

.hike-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.hike-details p {
  margin-bottom: 8px;
  color: #666;
}

.hike-description {
  margin-top: 12px;
  color: #666;
  line-height: 1.6;
}

.hike-details-modal {
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

.modal-program p {
  text-align: left;
  color: #666;
  line-height: 1.6;
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




