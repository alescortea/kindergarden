<template>
  <div class="activities-page">
    <!-- Mobile Back Button -->
    <div class="mobile-back-button">
      <a-button type="text" @click="goHome" class="back-btn">
        <ArrowLeftOutlined />
        Înapoi la pagina principală
      </a-button>
    </div>

    <div class="page-header">
      <h1>🎯 Toate Activitățile Noastre</h1>
      <p>Descoperă toate activitățile pe care le oferim pentru copii</p>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="8">
          <a-select
            v-model:value="filters.type"
            placeholder="Selectează Tipul de Activitate"
            style="width: 100%"
            @change="loadActivities"
          >
            <a-select-option value="">Toate Activitățile</a-select-option>
            <a-select-option 
              v-for="activityType in availableActivityTypes" 
              :key="activityType.value" 
              :value="activityType.value"
            >
              {{ activityType.label }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </div>

    <!-- Activities Grid -->
    <div class="activities-grid">
      <a-spin :spinning="loading">
        <a-row :gutter="[24, 24]">
          <!-- Afterschool Program -->
          <a-col 
            v-if="!filters.type || filters.type === 'afterschool'"
            :xs="24" 
            :sm="12" 
            :lg="8"
          >
            <a-card class="activity-card activity-afterschool" hoverable>
              <template #cover>
                <div class="activity-image">
                  <img v-if="afterschoolCardImage" :src="afterschoolCardImage" alt="Centru Afterschool" />
                  <BookOutlined v-else />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <h3>Centru Afterschool</h3>
                  <a-tag color="gold">Aproape de tine și de copilul tău!</a-tag>
                </template>
                <template #description>
                  <p><strong>Program:</strong> Luni-Vineri (12:00-17:30)</p>
                  <p><strong>Vacanțe școlare:</strong> Luni-Vineri (8:00-17:30)</p>
                  <p class="activity-description">Aproape de tine și de copilul tău! Program complet de afterschool pentru copii, cu activități educaționale și recreative.</p>
                </template>
              </a-card-meta>
              <template #actions>
                <a-button type="primary" @click="navigateToRegistration('afterschool', 'afterschool-program')">
                  <FormOutlined />
                  Înscrie-te
                </a-button>
              </template>
            </a-card>
          </a-col>

          <!-- Camps -->
          <a-col 
            v-for="camp in filteredCamps" 
            :key="`camp-${camp.id}`" 
            :xs="24" 
            :sm="12" 
            :lg="8"
          >
            <a-card class="activity-card activity-camp" hoverable>
              <template #cover>
                <div class="activity-image">
                  <img v-if="camp.gallery && camp.gallery.length > 0" :src="camp.gallery[0]" :alt="camp.name" />
                  <TeamOutlined v-else />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <h3>{{ camp.name }}</h3>
                  <a-tag color="blue">Tabere</a-tag>
                </template>
                <template #description>
                  <p><strong>Județ:</strong> {{ getLocationDisplay(camp) }}</p>
                  <p><strong>An:</strong> {{ camp.year }}</p>
                  <p><strong>Preț:</strong> {{ camp.price }} RON</p>
                  <p class="activity-description">{{ camp.description }}</p>
                </template>
              </a-card-meta>
              <template #actions>
                <a-button type="primary" @click="navigateToRegistration('camp', camp.id)">
                  <FormOutlined />
                  Înscrie-te
                </a-button>
              </template>
            </a-card>
          </a-col>

          <!-- Hikes -->
          <a-col 
            v-for="hike in filteredHikes" 
            :key="`hike-${hike.id}`" 
            :xs="24" 
            :sm="12" 
            :lg="8"
          >
            <a-card class="activity-card activity-hike" hoverable>
              <template #cover>
                <div class="activity-image">
                  <img v-if="hike.gallery && hike.gallery.length > 0" :src="hike.gallery[0]" :alt="hike.name" />
                  <EnvironmentOutlined v-else />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <h3>{{ hike.name }}</h3>
                  <a-tag color="green">Drumeții</a-tag>
                </template>
                <template #description>
                  <p><strong>Județ:</strong> {{ getLocationDisplay(hike) }}</p>
                  <p><strong>Dificultate:</strong> {{ getDifficultyLabel(hike.difficulty) }}</p>
                  <p><strong>Preț:</strong> {{ hike.price }} RON</p>
                  <p class="activity-description">{{ hike.description }}</p>
                </template>
              </a-card-meta>
              <template #actions>
                <a-button type="primary" @click="navigateToRegistration('hike', hike.id)">
                  <FormOutlined />
                  Înscrie-te
                </a-button>
              </template>
            </a-card>
          </a-col>

          <!-- Trips -->
          <a-col 
            v-for="trip in filteredTrips" 
            :key="`trip-${trip.id}`" 
            :xs="24" 
            :sm="12" 
            :lg="8"
          >
            <a-card class="activity-card activity-trip" hoverable>
              <template #cover>
                <div class="activity-image">
                  <img v-if="trip.gallery && trip.gallery.length > 0" :src="trip.gallery[0]" :alt="trip.name" />
                  <CarOutlined v-else />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <h3>{{ trip.name }}</h3>
                  <a-tag color="orange">Excursii</a-tag>
                </template>
                <template #description>
                  <p><strong>Județ:</strong> {{ getLocationDisplay(trip) }}</p>
                  <p><strong>Dată:</strong> {{ trip.date }}</p>
                  <p><strong>Preț:</strong> {{ trip.price }} RON</p>
                  <p class="activity-description">{{ trip.description }}</p>
                </template>
              </a-card-meta>
              <template #actions>
                <a-button type="primary" @click="navigateToRegistration('trip', trip.id)">
                  <FormOutlined />
                  Înscrie-te
                </a-button>
              </template>
            </a-card>
          </a-col>

          <!-- Ski Lessons -->
          <a-col 
            v-for="lesson in filteredSkiLessons" 
            :key="`ski-${lesson.id}`" 
            :xs="24" 
            :sm="12" 
            :lg="8"
          >
            <a-card class="activity-card activity-ski" hoverable>
              <template #cover>
                <div class="activity-image">
                  <img v-if="lesson.gallery && lesson.gallery.length > 0" :src="lesson.gallery[0]" alt="Ski Lesson" />
                  <TrophyOutlined v-else />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <h3>Lecție {{ getTypeLabel(lesson.type) }}</h3>
                  <a-tag color="purple">Lecții de Ski</a-tag>
                </template>
                <template #description>
                  <p><strong>Județ:</strong> {{ getLocationDisplay(lesson) }}</p>
                  <p><strong>Durata:</strong> {{ lesson.duration }}</p>
                  <p><strong>Preț:</strong> {{ lesson.price }} RON</p>
                  <p class="activity-description">{{ lesson.description }}</p>
                </template>
              </a-card-meta>
              <template #actions>
                <a-button type="primary" @click="navigateToRegistration('ski', lesson.id)">
                  <FormOutlined />
                  Înscrie-te
                </a-button>
              </template>
            </a-card>
          </a-col>

          <!-- Swimming Lessons -->
          <a-col 
            v-for="lesson in filteredSwimmingLessons" 
            :key="`swimming-${lesson.id}`" 
            :xs="24" 
            :sm="12" 
            :lg="8"
          >
            <a-card class="activity-card activity-swimming" hoverable>
              <template #cover>
                <div class="activity-image">
                  <img v-if="lesson.gallery && lesson.gallery.length > 0" :src="lesson.gallery[0]" alt="Swimming Lesson" />
                  <PlayCircleOutlined v-else />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <h3>Lecție {{ getTypeLabel(lesson.type) }}</h3>
                  <a-tag color="cyan">Lecții de Înot</a-tag>
                </template>
                <template #description>
                  <p><strong>Județ:</strong> {{ getLocationDisplay(lesson) }}</p>
                  <p><strong>Durata:</strong> {{ lesson.duration }}</p>
                  <p><strong>Preț:</strong> {{ lesson.price }} RON</p>
                  <p class="activity-description">{{ lesson.description }}</p>
                </template>
              </a-card-meta>
              <template #actions>
                <a-button type="primary" @click="navigateToRegistration('swimming', lesson.id)">
                  <FormOutlined />
                  Înscrie-te
                </a-button>
              </template>
            </a-card>
          </a-col>

          <!-- School Offers -->
          <a-col 
            v-for="offer in filteredSchoolOffers" 
            :key="`offer-${offer.id}`" 
            :xs="24" 
            :sm="12" 
            :lg="8"
          >
            <a-card class="activity-card" hoverable>
              <template #cover>
                <div class="activity-image">
                  <img v-if="offer.gallery && offer.gallery.length > 0" :src="offer.gallery[0]" :alt="offer.title" />
                  <BookOutlined v-else />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <h3>{{ offer.title }}</h3>
                  <a-tag color="magenta">Oferte Școlare</a-tag>
                </template>
                <template #description>
                  <p v-if="offer.price && !offer.customPrice"><strong>Preț:</strong> {{ offer.price }} RON</p>
                  <p v-else-if="offer.customPrice"><strong>Preț:</strong> Personalizat</p>
                  <p><strong>Transport:</strong> {{ offer.transportIncluded ? 'Inclus' : 'Neinclus' }}</p>
                  <p class="activity-description">{{ offer.description }}</p>
                </template>
              </a-card-meta>
              <template #actions>
                <a-button type="primary" @click="navigateToRegistration('school-offer', offer.id)">
                  <FormOutlined />
                  Contactează-ne
                </a-button>
              </template>
            </a-card>
          </a-col>
        </a-row>

        <div v-if="!loading && totalActivities === 0" class="no-activities">
          <p>Nu există activități disponibile pentru filtrele selectate.</p>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta Tags
useHead({
  title: 'Toate Activitățile | Activități pentru Copii | Roseli',
  meta: [
    { name: 'description', content: 'Descoperă toate activitățile pe care le oferim pentru copii: tabere, drumeții, excursii, lecții de ski și înot, afterschool în Brașov.' },
    { name: 'keywords', content: 'activități copii, tabere copii, drumeții copii, lecții ski, lecții înot, afterschool, activități Brașov' },
    { property: 'og:title', content: 'Toate Activitățile | Roseli' },
    { property: 'og:description', content: 'Descoperă toate activitățile pe care le oferim pentru copii' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro/activities' },
    { name: 'twitter:title', content: 'Toate Activitățile | Roseli' },
    { name: 'twitter:description', content: 'Descoperă toate activitățile pe care le oferim pentru copii' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro/activities' }
  ]
})
import {
  ArrowLeftOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CarOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  BookOutlined,
  FormOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

const loading = ref(false)
const filters = ref({
  type: ''
})

const camps = ref<any[]>([])
const hikes = ref<any[]>([])
const trips = ref<any[]>([])
const skiLessons = ref<any[]>([])
const swimmingLessons = ref<any[]>([])
const schoolOffers = ref<any[]>([])
const afterschoolCardImage = ref<string>('')

const goHome = () => {
  router.push('/')
}

const getLocationDisplay = (item: any) => {
  if (item.countyName) return item.countyName
  if (item.location) return item.location
  if (item.destination) {
    const labels: Record<string, string> = {
      'bucharest': 'București',
      'targu_mures': 'Târgu Mureș',
      'sibiu': 'Sibiu'
    }
    return labels[item.destination] || item.destination
  }
  return 'Nespecificat'
}

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    'easy': 'Ușor',
    'medium': 'Mediu',
    'hard': 'Greu'
  }
  return labels[difficulty?.toLowerCase()] || 'Nespecificat'
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'individual': 'Individuală',
    'group': 'Grup'
  }
  return labels[type] || type
}

const filteredCamps = computed(() => {
  if (filters.value.type && filters.value.type !== 'camp') return []
  return camps.value
})

const filteredHikes = computed(() => {
  if (filters.value.type && filters.value.type !== 'hike') return []
  return hikes.value
})

const filteredTrips = computed(() => {
  if (filters.value.type && filters.value.type !== 'trip') return []
  return trips.value
})

const filteredSkiLessons = computed(() => {
  if (filters.value.type && filters.value.type !== 'ski') return []
  return skiLessons.value
})

const filteredSwimmingLessons = computed(() => {
  if (filters.value.type && filters.value.type !== 'swimming') return []
  return swimmingLessons.value
})

const filteredSchoolOffers = computed(() => {
  if (filters.value.type && filters.value.type !== 'school-offer') return []
  return schoolOffers.value
})

const totalActivities = computed(() => {
  const afterschoolCount = (!filters.value.type || filters.value.type === 'afterschool') ? 1 : 0
  return filteredCamps.value.length +
    filteredHikes.value.length +
    filteredTrips.value.length +
    filteredSkiLessons.value.length +
    filteredSwimmingLessons.value.length +
    filteredSchoolOffers.value.length +
    afterschoolCount
})

// Computed property pentru activitățile disponibile în dropdown
const availableActivityTypes = computed(() => {
  const types: Array<{ value: string; label: string }> = []
  
  // Afterschool este întotdeauna disponibil
  types.push({ value: 'afterschool', label: 'Centru Afterschool' })
  
  // Verificăm ce activități au date
  if (camps.value.length > 0) {
    types.push({ value: 'camp', label: 'Tabere' })
  }
  if (hikes.value.length > 0) {
    types.push({ value: 'hike', label: 'Drumeții' })
  }
  if (trips.value.length > 0) {
    types.push({ value: 'trip', label: 'Excursii' })
  }
  if (skiLessons.value.length > 0) {
    types.push({ value: 'ski', label: 'Lecții de Ski' })
  }
  if (swimmingLessons.value.length > 0) {
    types.push({ value: 'swimming', label: 'Lecții de Înot' })
  }
  if (schoolOffers.value.length > 0) {
    types.push({ value: 'school-offer', label: 'Oferte Școlare' })
  }
  
  return types
})

const loadActivities = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadCamps(),
      loadHikes(),
      loadTrips(),
      loadSkiLessons(),
      loadSwimmingLessons(),
      loadSchoolOffers()
    ])
  } finally {
    loading.value = false
  }
}

const loadCamps = async () => {
  try {
    const response = await $fetch('/api/camps')
    camps.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load camps:', error)
    camps.value = []
  }
}

const loadHikes = async () => {
  try {
    const response = await $fetch('/api/hikes')
    hikes.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load hikes:', error)
    hikes.value = []
  }
}

const loadTrips = async () => {
  try {
    const response = await $fetch('/api/trips')
    trips.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load trips:', error)
    trips.value = []
  }
}

const loadSkiLessons = async () => {
  try {
    const response = await $fetch('/api/ski')
    skiLessons.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load ski lessons:', error)
    skiLessons.value = []
  }
}

const loadSwimmingLessons = async () => {
  try {
    const response = await $fetch('/api/swimming')
    swimmingLessons.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load swimming lessons:', error)
    swimmingLessons.value = []
  }
}

const loadSchoolOffers = async () => {
  try {
    const response = await $fetch('/api/school-offers')
    schoolOffers.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load school offers:', error)
    schoolOffers.value = []
  }
}

const navigateToRegistration = (activityType: string, activityId: string) => {
  router.push({
    path: '/registration',
    query: { activityType, activityId }
  })
}

const loadAfterschoolImage = () => {
  try {
    const savedInfo = localStorage.getItem('afterschool-program-info')
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo)
      if (parsed.cardImage) {
        afterschoolCardImage.value = parsed.cardImage
      }
    }
  } catch (error) {
    console.error('Error loading afterschool image:', error)
  }
}

onMounted(() => {
  loadActivities()
  loadAfterschoolImage()
})
</script>

<style scoped>
.activities-page {
  min-height: 100vh;
}

.mobile-back-button {
  display: none;
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
  margin-bottom: 32px;
}

.activities-grid {
  margin-bottom: 40px;
}

.activity-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

/* Colori pentru fiecare tip de activitate */
.activity-afterschool .activity-image {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.activity-camp .activity-image {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
}

.activity-hike .activity-image {
  background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
}

.activity-trip .activity-image {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
}

.activity-ski .activity-image {
  background: linear-gradient(135deg, #5DADE2 0%, #3498DB 100%);
}

.activity-swimming .activity-image {
  background: linear-gradient(135deg, #48C9B0 0%, #1ABC9C 100%);
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-image :deep(.anticon) {
  font-size: 4rem;
}

.activity-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.activity-description {
  margin-top: 12px;
  color: #666;
  line-height: 1.6;
  max-height: 150px;
  overflow-y: auto;
  word-wrap: break-word;
}

.no-activities {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
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

