<template>
  <!-- Hero Section -->
    <div class="hero-section">
      <a-row :gutter="24" align="middle">
        <a-col :xs="24" :lg="12">
          <div class="hero-content">
            <h1 class="hero-title">
              Roseli - Sport & Aventură pentru Copii 🏔️
            </h1>
            <p class="hero-description">
              Oferim experiențe unice de sport și aventură pentru copii: tabere, drumeții, excursii, 
              lecții de ski și înot. Transport cu microbuze dotate cu climă pentru pasageri.
            </p>
            <div class="hero-actions">
              <a-button type="primary" size="large" @click="navigateTo('/camps')">
                <TeamOutlined />
                Vezi Tabere
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
            <div class="image-placeholder">
              <TrophyOutlined />
              <p>Sport & Aventură</p>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">De Ce Să Ne Alegi?</h2>
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="6" v-for="feature in features" :key="feature.id">
          <a-card class="feature-card" :bordered="false">
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
          <a-card class="activity-card" hoverable @click="navigateTo(activity.route)">
            <div class="activity-image">
              <component :is="activity.icon" />
            </div>
            <h3>{{ activity.title }}</h3>
            <p>{{ activity.description }}</p>
          </a-card>
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
} from '@ant-design/icons-vue'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const features = [
  {
    id: 1,
    icon: 'HeartOutlined',
    title: 'Grijă cu Dragoste',
    description: 'Echipa noastră dedicată pune suflet în tot ce face pentru copii.'
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
    description: 'Construim relații puternice între copii, părinți și educatori.'
  }
]

const activities = [
  {
    id: 1,
    icon: 'TeamOutlined',
    title: 'Tabere',
    description: 'Tabere de vară și de iarnă în locații frumoase: Straja, Rafting, Delta Dunării, Colibița.',
    route: '/camps'
  },
  {
    id: 2,
    icon: 'EnvironmentOutlined',
    title: 'Drumeții',
    description: 'Drumeții de aventură la Vârful Ciucaș, Sfinxul & Babele, Lacul Scropoasa, Cascada 7 Izvoare, Cheile Zănoaga.',
    route: '/hikes'
  },
  {
    id: 3,
    icon: 'CarOutlined',
    title: 'Excursii',
    description: 'Excursii educaționale la București, Târgu Mureș, Sibiu și alte orașe.',
    route: '/trips'
  },
  {
    id: 4,
    icon: 'TrophyOutlined',
    title: 'Lecții de Ski',
    description: 'Lecții de ski individuale și de grup pentru toate nivelurile.',
    route: '/ski'
  },
  {
    id: 5,
    icon: 'PlayCircleOutlined',
    title: 'Lecții de Înot',
    description: 'Lecții de înot la locația Paradisul Acvatic.',
    route: '/swimming'
  },
  {
    id: 6,
    icon: 'BookOutlined',
    title: 'Oferte Școlare',
    description: 'Oferte personalizate pentru profesori care organizează excursii cu elevii.',
    route: '/school-offers'
  }
]

const stats = [
  { id: 1, number: '500+', label: 'Copii Fericiți' },
  { id: 2, number: '10+', label: 'Ani Experiență' },
  { id: 3, number: '100+', label: 'Activități Anuale' },
  { id: 4, number: '100%', label: 'Părinți Mulțumiți' }
]
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
  margin-bottom: 24px;
  margin-top: 0;
  line-height: 1.2;
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

.image-placeholder {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 80px 60px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.image-placeholder :deep(.anticon) {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
}

.image-placeholder p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.features-section,
.activities-section {
  margin-bottom: 80px;
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
  transition: transform 0.3s ease;
  cursor: pointer;
}

.feature-card:hover,
.activity-card:hover {
  transform: translateY(-5px);
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

