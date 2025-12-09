<template>
    <div class="school-offers-page">
      <!-- Mobile Back Button -->
      <div class="mobile-back-button">
        <a-button type="text" @click="goHome" class="back-btn">
          <ArrowLeftOutlined />
          Înapoi la pagina principală
        </a-button>
      </div>

      <div class="page-header">
        <h1>🏫 Oferte Școlare</h1>
        <p>Ești profesor și vrei să organizezi o excursie cu elevii tăi? Oferim transport și activități!</p>
      </div>

      <div class="offers-grid">
        <a-spin :spinning="loading">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="12" :lg="8" v-for="offer in offers" :key="offer.id">
              <a-card class="offer-card" hoverable>
                <template #cover>
                  <div class="offer-image">
                    <img v-if="offer.gallery && offer.gallery.length > 0" :src="offer.gallery[0]" :alt="offer.title" />
                    <BookOutlined v-else />
                  </div>
                </template>
                
                <a-card-meta>
                  <template #title>
                    <h3>{{ offer.title }}</h3>
                  </template>
                  <template #description>
                    <div class="offer-details">
                      <p v-if="offer.price && !offer.customPrice"><strong>Preț:</strong> {{ offer.price }} RON</p>
                      <p v-else-if="offer.customPrice"><strong>Preț:</strong> Personalizat</p>
                      <p v-if="offer.maxParticipants"><strong>Participanți Maxim:</strong> {{ offer.maxParticipants }}</p>
                      <p><strong>Transport:</strong> {{ offer.transportIncluded ? 'Inclus' : 'Neinclus' }}</p>
                    </div>
                    <p class="offer-description">{{ offer.description }}</p>
                    <div v-if="offer.activities && offer.activities.length > 0" class="offer-activities">
                      <h4>Activități:</h4>
                      <a-tag v-for="activity in offer.activities" :key="activity" color="blue">
                        {{ activity }}
                      </a-tag>
                    </div>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-button type="primary" @click="navigateToRegistration('afterschool', offer.id)">
                    <FormOutlined />
                    Contactează-ne
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
import { BookOutlined, FormOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const loading = ref(false)
const offers = ref<any[]>([])

const goHome = () => {
  router.push('/')
}

const loadOffers = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/school-offers')
    offers.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load school offers:', error)
  } finally {
    loading.value = false
  }
}

const navigateToRegistration = (activityType: string, activityId: string) => {
  router.push({
    path: '/registration',
    query: { activityType, activityId }
  })
}

onMounted(() => {
  loadOffers()
})
</script>

<style scoped>
.school-offers-page {
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

.offers-grid {
  margin-bottom: 40px;
}

.offer-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.offer-card:hover {
  transform: translateY(-5px);
}

.offer-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.offer-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.offer-image :deep(.anticon) {
  font-size: 4rem;
}

.offer-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.offer-details p {
  margin-bottom: 8px;
  color: #666;
}

.offer-description {
  margin-top: 12px;
  color: #666;
  line-height: 1.6;
}

.offer-activities {
  margin-top: 16px;
}

.offer-activities h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
}

.mobile-back-button {
  display: none;
}

@media (max-width: 768px) {
  .mobile-back-button {
    display: block;
    margin-bottom: 16px;
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




