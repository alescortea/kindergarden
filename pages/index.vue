<template>
  <!-- Hero Section with Carousel -->
    <div class="hero-section">
      <a-carousel 
        :autoplay="true" 
        :autoplay-speed="3000"
        :dots="showDots"
        :fade="true"
        :infinite="true"
        :touchable="true"
        :swipe="true"
        class="hero-carousel"
      >
        <div v-for="(image, index) in carouselImages" :key="index" class="carousel-slide">
          <div class="carousel-image-wrapper">
            <img :src="image.src" :alt="image.alt" class="carousel-image" />
            <div class="carousel-overlay">
              <div class="hero-content-overlay">
                <h1 class="hero-title">
                  Roseli - Sport & Aventură pentru Copii 🏔️
                </h1>
                <p class="hero-tagline">
                  Cresc prin sport, zâmbesc prin aventură!
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
            </div>
          </div>
        </div>
      </a-carousel>
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
      <a-spin :spinning="loadingGallery">
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
        <div v-if="!loadingGallery && galleryImages.length === 0" class="empty-gallery">
          <PictureOutlined />
          <p>Nu există imagini în galerie momentan.</p>
        </div>
      </a-spin>
    </div>

    <!-- Contact Footer Section -->
    <div class="stats-section contact-footer-section">
      <!-- Statistics Section -->
      <div class="footer-stats">
        <div class="stat-item" v-for="stat in stats" :key="stat.id">
          <div class="stat-number-large">{{ stat.number }}</div>
          <div class="stat-label-large">{{ stat.label }}</div>
        </div>
      </div>
      
      <!-- Contact Information -->
      <a-row :gutter="24" justify="center" style="margin-top: 40px;">
        <a-col :xs="24" :sm="12" :md="8">
          <div class="stat-item">
            <div class="stat-label"><strong>Adresă</strong></div>
            <div class="stat-number" style="font-size: 1.2rem; margin-top: 8px;">Str. Albatrosului Nr. 11<br>Avantgarden, Bartolomeu, Brașov</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8">
          <div class="stat-item">
            <div class="stat-label"><strong>Telefon</strong></div>
            <div class="stat-number" style="font-size: 1.2rem; margin-top: 8px;">
              <a href="https://wa.me/40724428883" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; color: white; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.98 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>0724428883</span>
              </a>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8">
          <div class="stat-item">
            <div class="stat-label"><strong>Facebook</strong></div>
            <div class="stat-number" style="font-size: 1.2rem; margin-top: 8px; display: flex; flex-direction: column; gap: 12px; align-items: center;">
              <a href="https://www.facebook.com/roselisportsiaventura/" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; color: white; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Sport & Aventură</span>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61551620890862" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; color: white; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Afterschool</span>
              </a>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="24" justify="center" style="margin-top: 24px;">
        <a-col :xs="24" :sm="12" :md="12">
          <div class="stat-item" style="text-align: center;">
            <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">
              <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" style="display: inline-block; transition: opacity 0.3s ease;">
                <img :src="anpcSalRoImage" alt="ANPC SAL" style="height: 60px; width: auto; object-fit: contain;" />
              </a>
              <a href="https://consumer-redress.ec.europa.eu/site-relocation_en?event=main.home.chooseLanguage" target="_blank" rel="noopener noreferrer" style="display: inline-block; transition: opacity 0.3s ease;">
                <img :src="anpcSalEuImage" alt="ANPC SAL EU" style="height: 60px; width: auto; object-fit: contain;" />
              </a>
            </div>
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

    <!-- WhatsApp Floating Button -->
    <a-button
      type="primary"
      class="whatsapp-float"
      @click="openWhatsApp"
      shape="circle"
      size="large"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.98 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a-button>
</template>

<script setup lang="ts">
// SEO Meta Tags
useHead({
  title: 'Activități Copii Brașov | Tabere Copii Brașov | Afterschool Brașov | Roseli',
  meta: [
    { name: 'description', content: 'Activități copii Brașov: tabere copii Brașov, afterschool Brașov, drumeții, excursii, lecții de ski și înot pentru copii în Brașov, România. Oferim experiențe unice de sport și aventură pentru copii.' },
    { name: 'keywords', content: 'activități copii Brașov, tabere copii Brașov, afterschool Brașov, tabere copii, drumeții copii, lecții ski copii, lecții înot copii, activități copii, afterschool, tabere, excursii educaționale, sport copii România, centru afterschool Brașov' },
    { property: 'og:title', content: 'Roseli - Sport & Aventură pentru Copii' },
    { property: 'og:description', content: 'Activități copii Brașov: tabere copii Brașov, afterschool Brașov, drumeții, excursii, lecții de ski și înot pentru copii în Brașov' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro' },
    { name: 'twitter:title', content: 'Roseli - Sport & Aventură pentru Copii' },
    { name: 'twitter:description', content: 'Activități sportive și de aventură pentru copii: tabere, drumeții, excursii, lecții de ski și înot în Brașov, România' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro' }
  ]
})
import { onMounted } from 'vue'
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
import logoImage from '~/assets/photo/Roseli_logo.png'
import swimmingBannerImage from '~/assets/photo/banner_swim.jpeg'
import anpcSalRoImage from '~/assets/photo/apnc_sal_ro.png'
import anpcSalEuImage from '~/assets/photo/apnc_sol_eu.png'
import carouselImage1 from '~/assets/photo/adrian-mag-Oe1LAdljP18-unsplash.jpg'
import carouselImage2 from '~/assets/photo/artem-kniaz-bC7zaV3j7S4-unsplash.jpg'
import carouselImage3 from '~/assets/photo/karine-avetisyan-fYYB1ZiMqXw-unsplash.jpg'
import carouselImage4 from '~/assets/photo/ruxandra-gogea-nEH_xpuuZt4-unsplash.jpg'

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
    title: 'Centru Afterschool',
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

const galleryImages = ref<Array<{ src: string, alt: string }>>([])
const loadingGallery = ref(false)

const stats = [
  { id: 1, number: '500+', label: 'Copii Fericiți' },
  { id: 2, number: '10+', label: 'Ani Experiență' },
  { id: 3, number: '100+', label: 'Activități Anuale' },
  { id: 4, number: '100%', label: 'Părinți Mulțumiți' }
]

const carouselImages = [
  { src: carouselImage1, alt: 'Aventură montană pentru copii' },
  { src: carouselImage2, alt: 'Copii în natură' },
  { src: carouselImage3, alt: 'Sport și aventură' },
  { src: carouselImage4, alt: 'Activități outdoor pentru copii' }
]

const imageViewerVisible = ref(false)
const selectedImage = ref<string>('')

// Hide dots on mobile
const showDots = ref(true)

const loadGallery = async () => {
  loadingGallery.value = true
  try {
    const response = await $fetch('/api/gallery')
    const items = Array.isArray(response) ? response : []
    
    // Flatten all images from all gallery items into a single array
    const allImages: Array<{ src: string, alt: string }> = []
    items.forEach((item: any) => {
      if (item.images && Array.isArray(item.images)) {
        item.images.forEach((imageUrl: string) => {
          allImages.push({
            src: imageUrl,
            alt: item.title || 'Imagine din galerie'
          })
        })
      }
    })
    
    galleryImages.value = allImages
  } catch (error) {
    console.error('Failed to load gallery:', error)
    // Fallback to empty array if API fails
    galleryImages.value = []
  } finally {
    loadingGallery.value = false
  }
}

onMounted(() => {
  const checkMobile = () => {
    showDots.value = window.innerWidth > 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Load gallery images from Firestore
  loadGallery()
})

const viewImage = (image: { src: string, alt: string }) => {
  selectedImage.value = image.src
  imageViewerVisible.value = true
}

const openWhatsApp = () => {
  const phoneNumber = '40724428883' // Numărul de WhatsApp
  const message = encodeURIComponent('Bună ziua! Am o întrebare despre activitățile Roseli.')
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
  window.open(whatsappUrl, '_blank')
}
</script>

<style scoped>
.hero-section {
  position: relative;
  margin: 0 -24px 60px -24px;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}

.hero-carousel {
  height: 600px;
}

.carousel-slide {
  position: relative;
  height: 600px;
}

.carousel-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.hero-content-overlay {
  max-width: 800px;
  text-align: center;
  color: white;
  z-index: 2;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  margin-top: 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-tagline {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 24px;
  font-style: italic;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 32px;
  margin-top: 0;
  opacity: 0.9;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
}

.hero-actions :deep(.anticon) {
  margin-top: -6px !important;
  vertical-align: middle;
}

.hero-actions .ant-btn :deep(.anticon) {
  margin-top: -6px !important;
  vertical-align: middle;
}

/* Carousel dots styling */
:deep(.ant-carousel .slick-dots) {
  bottom: 20px;
  z-index: 10;
}

:deep(.ant-carousel .slick-dots li button) {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 12px;
  height: 12px;
}

:deep(.ant-carousel .slick-dots li.slick-active button) {
  background: white;
}

:deep(.ant-carousel .slick-dots li) {
  margin: 0 4px;
}

/* Hide carousel dots on mobile */
@media (max-width: 768px) {
  :deep(.ant-carousel .slick-dots) {
    display: none !important;
  }
}

/* SVG icons margin */
:deep(.anticon) {
  margin-top: -6px !important;
  vertical-align: middle;
}

svg {
  margin-top: -6px !important;
  vertical-align: middle;
}

.image-placeholder p {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: white;
  opacity: 0.95;
}

.hero-logo-title {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.hero-rose-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .hero-rose-logo {
    height: 60px;
  }
  
  .hero-logo-title {
    flex-direction: column;
    gap: 12px;
    text-align: center;
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

.empty-gallery {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-gallery :deep(.anticon) {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 16px;
}

.empty-gallery p {
  font-size: 16px;
  color: #999;
  margin: 0;
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

/* Colori pentru cardurile "De ce să ne alegi?" - Albastru cer și Verde pădure */
.feature-1 {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(91, 155, 213, 0.6) 100%);
  color: #000;
  border: none;
}

.feature-1 h3,
.feature-1 p {
  color: #000;
}

.feature-1 .feature-icon :deep(.anticon) {
  color: #000;
}

.feature-2 {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.6) 0%, rgba(56, 142, 60, 0.6) 100%);
  color: #000;
  border: none;
}

.feature-2 h3,
.feature-2 p {
  color: #000;
}

.feature-2 .feature-icon :deep(.anticon) {
  color: #000;
}

.feature-3 {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(91, 155, 213, 0.6) 100%);
  color: #000;
  border: none;
}

.feature-3 h3,
.feature-3 p {
  color: #000;
}

.feature-3 .feature-icon :deep(.anticon) {
  color: #000;
}

.feature-4 {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.6) 0%, rgba(56, 142, 60, 0.6) 100%);
  color: #000;
  border: none;
}

.feature-4 h3,
.feature-4 p {
  color: #000;
}

.feature-4 .feature-icon :deep(.anticon) {
  color: #000;
}

/* Colori pentru cardurile de activități - Albastru cer și Verde pădure alternativ */
.activity-1 {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(91, 155, 213, 0.6) 100%);
  color: #000;
}

.activity-1 h3,
.activity-1 p {
  color: #000;
}

.activity-1 .activity-image :deep(.anticon) {
  color: #000;
}

.activity-2 {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.6) 0%, rgba(56, 142, 60, 0.6) 100%);
  color: #000;
}

.activity-2 h3,
.activity-2 p {
  color: #000;
}

.activity-2 .activity-image :deep(.anticon) {
  color: #000;
}

.activity-3 {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(91, 155, 213, 0.6) 100%);
  color: #000;
}

.activity-3 h3,
.activity-3 p {
  color: #000;
}

.activity-3 .activity-image :deep(.anticon) {
  color: #000;
}

.activity-4 {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.6) 0%, rgba(56, 142, 60, 0.6) 100%);
  color: #000;
}

.activity-4 h3,
.activity-4 p {
  color: #000;
}

.activity-4 .activity-image :deep(.anticon) {
  color: #000;
}

.activity-5 {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(91, 155, 213, 0.6) 100%);
  color: #000;
}

.activity-5 h3,
.activity-5 p {
  color: #000;
}

.activity-5 .activity-image :deep(.anticon) {
  color: #000;
}

.activity-6 {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.6) 0%, rgba(56, 142, 60, 0.6) 100%);
  color: #000;
}

.activity-6 h3,
.activity-6 p {
  color: #000;
}

.activity-6 .activity-image :deep(.anticon) {
  color: #000;
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

.stats-section.contact-footer-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 60px 0;
  margin: 60px -24px 0 -24px;
  border-radius: 20px 20px 0 0;
}

.contact-footer-section .stat-item {
  text-align: center;
  margin-bottom: 20px;
}

.contact-footer-section .stat-number {
  font-size: 1.2rem;
  font-weight: 400;
  color: white;
  margin-bottom: 8px;
  line-height: 1.6;
}

.footer-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-number-large {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.stat-label-large {
  font-size: 1.2rem;
  color: white;
  opacity: 0.9;
}

.contact-footer-section .stat-label {
  font-size: 1.3rem;
  font-weight: 600;
  opacity: 1;
  margin-bottom: 12px;
  color: white;
}

.contact-footer-section .stat-label strong {
  color: white;
}

.contact-footer-section .stat-number {
  color: white;
}

.contact-footer-section .stat-number a {
  color: white !important;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.contact-footer-section .stat-number a:hover {
  text-decoration: underline;
  opacity: 0.8;
}

@media (max-width: 992px) {
  .hero-carousel {
    height: 550px;
  }
  
  .carousel-slide {
    height: 550px;
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
  .hero-carousel {
    height: 500px;
  }
  
  .carousel-slide {
    height: 500px;
  }
  
  .carousel-overlay {
    padding: 20px;
  }
  
  .hero-section {
    margin: 0 -16px 40px -16px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-tagline {
    font-size: 1.2rem;
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

@media (max-width: 480px) {
  .hero-carousel {
    height: 400px;
  }
  
  .carousel-slide {
    height: 400px;
  }
  
  .carousel-overlay {
    padding: 16px;
  }
  
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-tagline {
    font-size: 1rem;
  }
  
  .hero-description {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
  
  .hero-actions {
    gap: 12px;
  }
  
  .hero-actions .ant-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}

/* WhatsApp Floating Button */
.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: #25D366 !important;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
}

.whatsapp-float:focus {
  background: #25D366 !important;
}

.whatsapp-float svg {
  width: 28px;
  height: 28px;
}

@media (max-width: 768px) {
  .whatsapp-float {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
  
  .whatsapp-float svg {
    width: 24px;
    height: 24px;
  }
}
</style>

