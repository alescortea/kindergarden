<template>
  <!-- Hero Section -->
    <div class="hero-section">
      <a-row :gutter="24" align="middle">
        <a-col :xs="24" :lg="12">
          <div class="hero-content">
            <h1 class="hero-title">
              Roseli - Sport & Aventură pentru Copii 🏔️
            </h1>
            <p class="hero-tagline">
              Cresc prin sport. Zambesc prin aventură.
            </p>
            <p class="hero-description">
              Oferim experiențe unice de sport și aventură pentru copii: tabere, drumeții, excursii, 
              lecții de ski și înot.
            </p>
            <div class="hero-actions">
              <a-button type="primary" size="large" @click="navigateTo('/activities')">
                <TrophyOutlined />
                Vezi Activități
              </a-button>
              <a-button size="large" @click="navigateTo('/registration')">
                <FormOutlined />
                Înscrie-te Acum
              </a-button>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :lg="12">
          <div class="hero-image">
            <img :src="logoImage" alt="Roseli - Centrul Educational & Sportiv Brasov" class="hero-logo" />
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">De ce să ne alegi?</h2>
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="6" v-for="feature in features" :key="feature.id">
          <a-card class="feature-card" :class="`feature-${feature.id}`" :bordered="false">
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Activities Section -->
    <div class="activities-section">
      <h2 class="section-title">Activitățile Noastre</h2>
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="activity in activities" :key="activity.id">
          <a-card 
            class="activity-card" 
            :class="`activity-${activity.id}`"
            hoverable 
            @click="navigateTo(activity.route)"
          >
            <div class="activity-image">
              <component :is="activity.icon" />
            </div>
            <h3>{{ activity.title }}</h3>
            <p>{{ activity.description }}</p>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Gallery Section -->
    <div class="gallery-section">
      <h2 class="section-title">Galerie Foto</h2>
      <p class="section-subtitle">Momente din activitățile noastre</p>
      <a-row :gutter="[16, 16]">
        <a-col 
          :xs="12" 
          :sm="8" 
          :md="6" 
          v-for="(image, index) in galleryImages" 
          :key="index"
        >
          <div class="gallery-item" @click="viewImage(image)">
            <img :src="image.src" :alt="image.alt" />
            <div class="gallery-overlay">
              <EyeOutlined />
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <a-row :gutter="24" justify="center">
        <a-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.id">
          <div class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- Image Viewer Modal -->
    <a-modal
      v-model:open="imageViewerVisible"
      :footer="null"
      :width="900"
      centered
      @cancel="imageViewerVisible = false"
    >
      <div class="image-viewer">
        <img :src="selectedImage" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;" />
      </div>
    </a-modal>
</template>

<script setup lang="ts">
import {
  CarOutlined,
  FormOutlined,
  TrophyOutlined,
  HeartOutlined,
  BookOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  PlayCircleOutlined,
  ExperimentOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'
import logoImage from '~/assets/photo/logo.png.jpeg'
import swimmingBannerImage from '~/assets/photo/banner_swim.jpeg'
import beachImage from '~/assets/photo/beach.jpg'
import boatImage from '~/assets/photo/boat.jpg'
import bucharestTripImage from '~/assets/photo/bucharest_trip.jpg'
import bucharestImage from '~/assets/photo/bucharest.jpg'
import danubeImage from '~/assets/photo/danube.jpg'
import mountainsImage from '~/assets/photo/mountains.jpg'
import raftingImage from '~/assets/photo/rafting.jpeg'
import skiBrasovImage from '~/assets/photo/ski_brasov.jpg'
import skiImage from '~/assets/photo/ski.jpg'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const features = [
  {
    id: 1,
    icon: 'HeartOutlined',
    title: 'Grijă cu Dragoste',
    description: 'Echipa noastră dedicată pune suflet în tot ce face pentru copii, oferind acestora un mediu armonios de dezvoltare.'
  },
  {
    id: 2,
    icon: 'BookOutlined',
    title: 'Educație de Calitate',
    description: 'Programe educaționale moderne adaptate vârstelor copiilor.'
  },
  {
    id: 3,
    icon: 'SecurityScanOutlined',
    title: 'Siguranță Maximă',
    description: 'Mediu sigur și protejat pentru dezvoltarea copiilor.'
  },
  {
    id: 4,
    icon: 'TeamOutlined',
    title: 'Comunitate',
    description: 'Construim relații puternice între copii, părinți și indrumatori.'
  }
]

const activities = [
  {
    id: 1,
    icon: 'BookOutlined',
    title: 'Program Afterschool',
    description: 'Aproape de tine și de copilul tău! Program: Luni-Vineri (12:00-17:30). În perioada vacanțelor școlare: Luni-Vineri (8:00-17:30).',
    route: '/afterschool'
  },
  {
    id: 2,
    icon: 'TeamOutlined',
    title: 'Tabere',
    description: 'Tabere de iarnă și de vară în cele mai frumoase locații din țară.',
    route: '/camps'
  },
  {
    id: 3,
    icon: 'EnvironmentOutlined',
    title: 'Drumeții',
    description: 'Drumeții montane și de aventură pentru a descoperi frumusețea unică a fiecărui masiv montan românesc.',
    route: '/hikes'
  },
  {
    id: 4,
    icon: 'CarOutlined',
    title: 'Excursii',
    description: 'Explorăm orașele țării organizând excursii educaționale.',
    route: '/trips'
  },
  {
    id: 5,
    icon: 'TrophyOutlined',
    title: 'Lecții de Ski',
    description: 'Lecții de ski individuale și de grup pentru toate nivelurile.',
    route: '/ski'
  },
  {
    id: 6,
    icon: 'PlayCircleOutlined',
    title: 'Lecții de Înot',
    description: 'Lecții de înot individuale și de grup pentru toate nivelurile.',
    route: '/swimming'
  }
]

const stats = [
  { id: 1, number: '500+', label: 'Copii Fericiți' },
  { id: 2, number: '10+', label: 'Ani Experiență' },
  { id: 3, number: '100+', label: 'Activități Anuale' },
  { id: 4, number: '100%', label: 'Părinți Mulțumiți' }
]

const galleryImages = [
  { src: beachImage, alt: 'Tabere la plajă' },
  { src: boatImage, alt: 'Excursie cu barca' },
  { src: bucharestTripImage, alt: 'Excursie la București' },
  { src: bucharestImage, alt: 'București' },
  { src: danubeImage, alt: 'Delta Dunării' },
  { src: mountainsImage, alt: 'Drumeții în munți' },
  { src: raftingImage, alt: 'Rafting' },
  { src: skiBrasovImage, alt: 'Lecții de ski în Brașov' },
  { src: skiImage, alt: 'Lecții de ski' }
]

const imageViewerVisible = ref(false)
const selectedImage = ref<string>('')

const viewImage = (image: { src: string, alt: string }) => {
  selectedImage.value = image.src
  imageViewerVisible.value = true
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 40px;
  margin: 0 -24px 60px -24px;
  border-radius: 0 0 20px 20px;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  margin-top: 0;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 24px;
  font-style: italic;
  opacity: 0.95;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 32px;
  margin-top: 0;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.hero-logo {
  max-width: 300px;
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background: white;
  padding: 15px;
  display: block;
  margin: 0 auto;
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-logo {
    max-width: 250px;
    padding: 10px;
  }
}

.features-section,
.activities-section,
.gallery-section {
  margin-bottom: 80px;
}

.swimming-banner-section {
  margin-bottom: 80px;
}

.swimming-banner {
  background: linear-gradient(135deg, #48C9B0 0%, #1ABC9C 100%);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-height: 300px;
}

.banner-content {
  flex: 1;
  padding: 40px;
  color: white;
  z-index: 2;
}

.banner-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.banner-content p {
  font-size: 1.2rem;
  margin-bottom: 24px;
  opacity: 0.95;
}

.banner-image {
  flex: 1;
  height: 300px;
  overflow: hidden;
  position: relative;
}

.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-section {
  text-align: center;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 50px;
  color: #2c3e50;
}

.feature-card,
.activity-card {
  text-align: center;
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: none;
  overflow: hidden;
  position: relative;
}

.feature-card:hover,
.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon,
.activity-image {
  margin-bottom: 20px;
}

.feature-icon :deep(.anticon),
.activity-image :deep(.anticon) {
  font-size: 3rem;
  color: #667eea;
}

/* Colori pentru cardurile "De ce să ne alegi?" */
.feature-1 {
  background: linear-gradient(135deg, #FF6B9D 0%, #C44569 100%);
  color: white;
  border: none;
}

.feature-1 h3,
.feature-1 p {
  color: white;
}

.feature-1 .feature-icon :deep(.anticon) {
  color: white;
}

.feature-2 {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  border: none;
}

.feature-2 h3,
.feature-2 p {
  color: white;
}

.feature-2 .feature-icon :deep(.anticon) {
  color: white;
}

.feature-3 {
  background: linear-gradient(135deg, #A8E6CF 0%, #7FCDBB 100%);
  color: white;
  border: none;
}

.feature-3 h3,
.feature-3 p {
  color: white;
}

.feature-3 .feature-icon :deep(.anticon) {
  color: white;
}

.feature-4 {
  background: linear-gradient(135deg, #FFD93D 0%, #F6C23E 100%);
  color: white;
  border: none;
}

.feature-4 h3,
.feature-4 p {
  color: white;
}

.feature-4 .feature-icon :deep(.anticon) {
  color: white;
}

/* Colori pentru cardurile de activități */
.activity-1 {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
}

.activity-1 h3,
.activity-1 p {
  color: white;
}

.activity-1 .activity-image :deep(.anticon) {
  color: white;
}

.activity-2 {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
}

.activity-2 h3,
.activity-2 p {
  color: white;
}

.activity-2 .activity-image :deep(.anticon) {
  color: white;
}

.activity-3 {
  background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
  color: white;
}

.activity-3 h3,
.activity-3 p {
  color: white;
}

.activity-3 .activity-image :deep(.anticon) {
  color: white;
}

.activity-4 {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
  color: white;
}

.activity-4 h3,
.activity-4 p {
  color: white;
}

.activity-4 .activity-image :deep(.anticon) {
  color: white;
}

.activity-5 {
  background: linear-gradient(135deg, #5DADE2 0%, #3498DB 100%);
  color: white;
}

.activity-5 h3,
.activity-5 p {
  color: white;
}

.activity-5 .activity-image :deep(.anticon) {
  color: white;
}

.activity-6 {
  background: linear-gradient(135deg, #48C9B0 0%, #1ABC9C 100%);
  color: white;
}

.activity-6 h3,
.activity-6 p {
  color: white;
}

.activity-6 .activity-image :deep(.anticon) {
  color: white;
}

.feature-card h3,
.activity-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  margin-top: 8px;
  color: #2c3e50;
}

.feature-card p,
.activity-card p {
  margin-bottom: 0;
  line-height: 1.6;
}

.stats-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 60px 0;
  margin: 60px -24px -24px -24px;
  border-radius: 20px 20px 0 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 992px) {
  .hero-section {
    padding: 80px 30px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2.2rem;
  }

  .swimming-banner {
    flex-direction: column;
    min-height: auto;
  }

  .banner-image {
    height: 200px;
    width: 100%;
  }

  .banner-content {
    padding: 30px 20px;
  }

  .banner-content h2 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px;
    margin: 0 -16px 40px -16px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .hero-actions .ant-btn {
    width: 100%;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>

