<template>
    <div class="camps-page">
      <!-- Mobile Back Button -->
      <div class="mobile-back-button">
        <a-button type="text" @click="goHome" class="back-btn">
          <ArrowLeftOutlined />
          Înapoi la pagina principală
        </a-button>
      </div>

      <div class="page-header">
        <h1>🏕️ Taberele Noastre</h1>
        <p>Tabere de aventură pentru copii în locații frumoase din România</p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="8" :md="6">
            <a-select
              v-model:value="filters.year"
              placeholder="Selectează Anul"
              style="width: 100%"
              @change="loadCamps"
            >
              <a-select-option value="">Toți Anii</a-select-option>
              <a-select-option value="2024">2024</a-select-option>
              <a-select-option value="2025">2025</a-select-option>
              <a-select-option value="2026">2026</a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="8" :md="6">
            <a-select
              v-model:value="filters.county"
              placeholder="Selectează Județul"
              style="width: 100%"
              @change="loadCamps"
              show-search
              :filter-option="true"
            >
              <a-select-option value="">Toate Județele</a-select-option>
              <a-select-option v-for="county in allCounties" :key="county.id" :value="county.id">
                {{ county.name }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>

      <!-- Camps Grid -->
      <div class="camps-grid">
        <a-spin :spinning="loading">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="12" :lg="8" v-for="camp in camps" :key="camp.id">
              <a-card class="camp-card" hoverable>
                <template #cover>
                  <div class="camp-image">
                    <img v-if="camp.gallery && camp.gallery.length > 0" :src="camp.gallery[0]" :alt="camp.name" />
                    <TeamOutlined v-else />
                  </div>
                </template>
                
                <a-card-meta>
                  <template #title>
                    <h3>{{ camp.name }}</h3>
                  </template>
                  <template #description>
                    <div class="camp-details">
                      <p><strong>Locația:</strong> {{ getLocationLabel(camp) }}</p>
                      <p><strong>Perioada:</strong> {{ camp.startDate }} - {{ camp.endDate }}</p>
                      <p><strong>Preț:</strong> {{ camp.price }} RON</p>
                      <p><strong>Participanți:</strong> {{ camp.currentParticipants }}/{{ camp.maxParticipants }}</p>
                    </div>
                    <p class="camp-description">{{ camp.description }}</p>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-button type="primary" @click="navigateToRegistration('camp', camp.id)">
                    <FormOutlined />
                    Înscriere
                  </a-button>
                  <a-button @click="viewCampDetails(camp)">
                    <EyeOutlined />
                    Detalii
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </div>

      <!-- Camp Details Modal -->
      <a-modal
        v-model:open="detailsModalVisible"
        :title="selectedCamp?.name"
        :width="800"
        :footer="null"
      >
        <div v-if="selectedCamp" class="camp-details-modal">
          <div class="modal-image" v-if="selectedCamp.gallery && selectedCamp.gallery.length > 0">
            <img :src="selectedCamp.gallery[0]" :alt="selectedCamp.name" />
          </div>
          
          <div class="modal-content">
            <p class="modal-description">{{ selectedCamp.description }}</p>
            
            <div class="modal-details">
              <h4>Informații Tabără:</h4>
              <ul>
                <li><strong>Locația:</strong> {{ getLocationLabel(selectedCamp) }}</li>
                <li><strong>Perioada:</strong> {{ selectedCamp.startDate }} - {{ selectedCamp.endDate }}</li>
                <li><strong>Preț:</strong> {{ selectedCamp.price }} RON</li>
                <li><strong>Participanți Maxim:</strong> {{ selectedCamp.maxParticipants }}</li>
                <li><strong>Participanți Curenți:</strong> {{ selectedCamp.currentParticipants }}</li>
              </ul>
            </div>

            <div v-if="selectedCamp.program" class="modal-program">
              <h4>Program:</h4>
              <p>{{ selectedCamp.program }}</p>
            </div>

            <div v-if="selectedCamp.details" class="modal-details-text">
              <h4>Detalii Suplimentare:</h4>
              <p>{{ selectedCamp.details }}</p>
            </div>

            <div class="modal-actions">
              <a-button type="primary" size="large" @click="navigateToRegistration('camp', selectedCamp.id)">
                <FormOutlined />
                Înscriere la Această Tabără
              </a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </template>

<script setup lang="ts">
import { TeamOutlined, FormOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'

// SEO Meta Tags
useHead({
  title: 'Tabere pentru Copii | Tabere de Vară și Iarnă | Roseli',
  meta: [
    { name: 'description', content: 'Tabere de aventură pentru copii în locații frumoase din România. Tabere de vară și iarnă cu activități sportive și educaționale pentru copii.' },
    { name: 'keywords', content: 'tabere copii, tabere vară copii, tabere iarnă copii, tabere aventură, tabere Brașov, tabere România' },
    { property: 'og:title', content: 'Tabere pentru Copii | Roseli' },
    { property: 'og:description', content: 'Tabere de aventură pentru copii în locații frumoase din România' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro/camps' },
    { name: 'twitter:title', content: 'Tabere pentru Copii | Roseli' },
    { name: 'twitter:description', content: 'Tabere de aventură pentru copii în locații frumoase din România' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro/camps' }
  ]
})

const router = useRouter()

const loading = ref(false)
const camps = ref<any[]>([])
const allCounties = ref<any[]>([])
const filters = ref({
  year: '',
  county: ''
})
const detailsModalVisible = ref(false)
const selectedCamp = ref<any>(null)

const goHome = () => {
  router.push('/')
}

const loadAllCounties = async () => {
  try {
    const response = await $fetch('/api/counties')
    allCounties.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load counties:', error)
    allCounties.value = []
  }
}

const loadCamps = async () => {
  loading.value = true
  try {
    const query: any = {}
    if (filters.value.year && filters.value.year !== '') {
      query.year = filters.value.year
    }
    if (filters.value.county && filters.value.county !== '') {
      query.countyId = filters.value.county
    }

    const response = await $fetch('/api/camps', { query })
    camps.value = Array.isArray(response) ? response : []
    console.log('Loaded camps:', camps.value.length, 'with filters:', query)
  } catch (error) {
    console.error('Failed to load camps:', error)
    camps.value = []
  } finally {
    loading.value = false
  }
}

const getLocationLabel = (camp: any) => {
  // Support for new location structure (county only)
  if (camp.countyName) {
    return camp.countyName
  }
  // Fallback for old location structure
  if (camp.location) {
    const labels: Record<string, string> = {
      'straja': 'Straja',
      'rafting': 'Rafting',
      'danube_delta': 'Delta Dunării',
      'colibita': 'Colibița'
    }
    return labels[camp.location] || camp.location
  }
  return 'Nespecificat'
}

const viewCampDetails = (camp: any) => {
  selectedCamp.value = camp
  detailsModalVisible.value = true
}

const navigateToRegistration = (activityType: string, activityId: string) => {
  router.push({
    path: '/registration',
    query: { activityType, activityId }
  })
}

onMounted(() => {
  loadCamps()
  loadAllCounties()
})
</script>

<style scoped>
.camps-page {
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

.camps-grid {
  margin-bottom: 40px;
}

.camp-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.camp-card:hover {
  transform: translateY(-5px);
}

.camp-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.camp-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camp-image :deep(.anticon) {
  font-size: 4rem;
}

.camp-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.camp-details p {
  margin-bottom: 8px;
  color: #666;
}

.camp-description {
  margin-top: 12px;
  color: #666;
  line-height: 1.6;
}

.camp-details-modal {
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
  
  .filters-section {
    padding: 16px;
  }
}
</style>




