<template>
    <div class="trips-page">
      <!-- Mobile Back Button -->
      <div class="mobile-back-button">
        <a-button type="text" @click="goHome" class="back-btn">
          <ArrowLeftOutlined />
          Înapoi la pagina principală
        </a-button>
      </div>

      <div class="page-header">
        <h1>🗺️ Excursii Educaționale</h1>
        <p>Descoperă România prin excursii educaționale în orașele majore</p>
      </div>

      <div class="trips-grid">
        <a-spin :spinning="loading">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="12" :lg="8" v-for="trip in trips" :key="trip.id">
              <a-card class="trip-card" hoverable>
                <template #cover>
                  <div class="trip-image">
                    <img v-if="trip.gallery && trip.gallery.length > 0" :src="trip.gallery[0]" :alt="trip.name" />
                    <CarOutlined v-else />
                  </div>
                </template>
                
                <a-card-meta>
                  <template #title>
                    <h3>{{ trip.name }}</h3>
                  </template>
                  <template #description>
                    <div class="trip-details">
                      <p><strong>Județ:</strong> {{ getLocationDisplay(trip) }}</p>
                      <p><strong>Dată:</strong> {{ trip.date }}</p>
                      <p><strong>Durata:</strong> {{ trip.duration }}</p>
                      <p><strong>Preț:</strong> {{ trip.price }} RON</p>
                    </div>
                    <p class="trip-description">{{ trip.description }}</p>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-button type="primary" @click="navigateToRegistration('trip', trip.id)">
                    <FormOutlined />
                    Înscrie-te
                  </a-button>
                  <a-button @click="viewTripDetails(trip)">
                    <EyeOutlined />
                    Detalii
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </div>

      <!-- Trip Details Modal -->
      <a-modal
        v-model:open="detailsModalVisible"
        :title="selectedTrip?.name"
        :width="800"
        :footer="null"
      >
        <div v-if="selectedTrip" class="trip-details-modal">
          <div class="modal-image" v-if="selectedTrip.gallery && selectedTrip.gallery.length > 0">
            <img :src="selectedTrip.gallery[0]" :alt="selectedTrip.name" />
          </div>
          
          <div class="modal-content">
            <p class="modal-description">{{ selectedTrip.description }}</p>
            
            <div class="modal-details">
              <h4>Informații Excursie:</h4>
              <ul>
                <li><strong>Județ:</strong> {{ getLocationDisplay(selectedTrip) }}</li>
                <li><strong>Dată:</strong> {{ selectedTrip.date }}</li>
                <li><strong>Durata:</strong> {{ selectedTrip.duration }}</li>
                <li><strong>Preț:</strong> {{ selectedTrip.price }} RON</li>
                <li><strong>Participanți Maxim:</strong> {{ selectedTrip.maxParticipants }}</li>
              </ul>
            </div>

            <div v-if="selectedTrip.program" class="modal-program">
              <h4>Program:</h4>
              <p>{{ selectedTrip.program }}</p>
            </div>

            <div v-if="selectedTrip.details" class="modal-details-text">
              <h4>Detalii Suplimentare:</h4>
              <p>{{ selectedTrip.details }}</p>
            </div>

            <div class="modal-actions">
              <a-button type="primary" size="large" @click="navigateToRegistration('trip', selectedTrip.id)">
                <FormOutlined />
                Înscrie-te la această Excursie
              </a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </template>

<script setup lang="ts">
import { CarOutlined, FormOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'

// SEO Meta Tags
useHead({
  title: 'Excursii Educaționale pentru Copii | Roseli',
  meta: [
    { name: 'description', content: 'Excursii educaționale pentru copii în orașele majore ale României. Descoperă România prin excursii educaționale organizate pentru copii.' },
    { name: 'keywords', content: 'excursii copii, excursii educaționale, excursii școlare, excursii Brașov, excursii România' },
    { property: 'og:title', content: 'Excursii Educaționale pentru Copii | Roseli' },
    { property: 'og:description', content: 'Descoperă România prin excursii educaționale organizate pentru copii' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro/trips' },
    { name: 'twitter:title', content: 'Excursii Educaționale pentru Copii | Roseli' },
    { name: 'twitter:description', content: 'Descoperă România prin excursii educaționale organizate pentru copii' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro/trips' }
  ]
})

const router = useRouter()

const loading = ref(false)
const trips = ref<any[]>([])
const detailsModalVisible = ref(false)
const selectedTrip = ref<any>(null)

const goHome = () => {
  router.push('/')
}

const loadTrips = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/trips')
    trips.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load trips:', error)
  } finally {
    loading.value = false
  }
}

const getLocationDisplay = (trip: any) => {
  if (trip.countyName) {
    return trip.countyName
  }
  if (trip.destination) {
    // Fallback pentru vechile date
    const labels: Record<string, string> = {
      'bucharest': 'București',
      'targu_mures': 'Târgu Mureș',
      'sibiu': 'Sibiu'
    }
    return labels[trip.destination] || trip.destination
  }
  return 'Nespecificat'
}

const viewTripDetails = (trip: any) => {
  selectedTrip.value = trip
  detailsModalVisible.value = true
}

const navigateToRegistration = (activityType: string, activityId: string) => {
  router.push({
    path: '/registration',
    query: { activityType, activityId }
  })
}

onMounted(() => {
  loadTrips()
})
</script>

<style scoped>
.trips-page {
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

.trips-grid {
  margin-bottom: 40px;
}

.trip-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.trip-card:hover {
  transform: translateY(-5px);
}

.trip-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.trip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trip-image :deep(.anticon) {
  font-size: 4rem;
}

.trip-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.trip-details p {
  margin-bottom: 8px;
  color: #666;
}

.trip-description {
  margin-top: 12px;
  color: #666;
  line-height: 1.6;
}

.trip-details-modal {
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
.modal-program h4,
.modal-details-text h4 {
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

.modal-program p,
.modal-details-text p {
  text-align: left;
  color: #666;
  line-height: 1.6;
}

.modal-actions {
  margin-top: 24px;
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




