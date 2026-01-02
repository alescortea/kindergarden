<template>
  <a-layout style="min-height: 100vh; display: flex; flex-direction: column;">
    <a-layout-header class="header">
      <div class="header-content">
        <a-button 
          class="mobile-menu-toggle"
          @click="mobileMenuVisible = !mobileMenuVisible"
          type="text"
        >
          <MenuOutlined v-if="!mobileMenuVisible" />
          <CloseOutlined v-else />
        </a-button>
        
        <div class="logo">
          <NuxtLink to="/">
            <img :src="logoImage" alt="Roseli" class="logo-image" />
            <h2 class="logo-text">Roseli</h2>
          </NuxtLink>
        </div>
        
        <a-menu
          theme="dark"
          mode="horizontal"
          :selected-keys="selectedKeys"
          class="menu desktop-menu"
        >
          <a-menu-item key="home" @click="navigateTo('/')">
            <HomeOutlined />
            Acasă
          </a-menu-item>
          <a-menu-item key="camps" @click="navigateTo('/camps')">
            <TeamOutlined />
            Tabere
          </a-menu-item>
          <a-menu-item key="hikes" @click="navigateTo('/hikes')">
            <EnvironmentOutlined />
            Drumeții
          </a-menu-item>
          <a-menu-item key="trips" @click="navigateTo('/trips')">
            <CarOutlined />
            Excursii
          </a-menu-item>
          <a-menu-item key="ski" @click="navigateTo('/ski')">
            <TrophyOutlined />
            Lecții de Ski
          </a-menu-item>
          <a-menu-item key="swimming" @click="navigateTo('/swimming')">
            <PlayCircleOutlined />
            Înot
          </a-menu-item>
          <a-menu-item key="afterschool" @click="navigateTo('/afterschool')">
            <BookOutlined />
            Afterschool
          </a-menu-item>
          <a-menu-item key="school-offers" @click="navigateTo('/school-offers')">
            <BookOutlined />
            Oferte Școlare
          </a-menu-item>
          <a-menu-item key="gallery" @click="navigateTo('/gallery')">
            <PictureOutlined />
            Galerie
          </a-menu-item>
          <a-menu-item key="notice-board" @click="navigateTo('/notice-board')">
            <NotificationOutlined />
            Anunțuri
          </a-menu-item>
          <a-menu-item key="registration" @click="navigateTo('/registration')">
            <FormOutlined />
            Înscriere
          </a-menu-item>
          <a-menu-item key="contact" @click="navigateTo('/#contact')">
            <ContactsOutlined />
            Contact
          </a-menu-item>
          <a-menu-item key="admin" @click="navigateTo('/admin')" v-if="isAdmin">
            <SettingOutlined />
            Admin
          </a-menu-item>
        </a-menu>
      </div>
      
      <a-drawer
        v-model:open="mobileMenuVisible"
        placement="left"
        :closable="false"
        :width="280"
        class="mobile-menu-drawer"
      >
        <a-menu
          theme="light"
          mode="vertical"
          :selected-keys="selectedKeys"
          @click="handleMobileMenuClick"
        >
          <a-menu-item key="home">
            <HomeOutlined />
            Acasă
          </a-menu-item>
          <a-menu-item key="camps">
            <TeamOutlined />
            Tabere
          </a-menu-item>
          <a-menu-item key="hikes">
            <EnvironmentOutlined />
            Drumeții
          </a-menu-item>
          <a-menu-item key="trips">
            <CarOutlined />
            Excursii
          </a-menu-item>
          <a-menu-item key="ski">
            <TrophyOutlined />
            Lecții de Ski
          </a-menu-item>
          <a-menu-item key="swimming">
            <PlayCircleOutlined />
            Înot
          </a-menu-item>
          <a-menu-item key="afterschool">
            <BookOutlined />
            Afterschool
          </a-menu-item>
          <a-menu-item key="school-offers">
            <BookOutlined />
            Oferte Școlare
          </a-menu-item>
          <a-menu-item key="gallery">
            <PictureOutlined />
            Galerie
          </a-menu-item>
          <a-menu-item key="notice-board">
            <NotificationOutlined />
            Anunțuri
          </a-menu-item>
          <a-menu-item key="registration">
            <FormOutlined />
            Înscriere
          </a-menu-item>
          <a-menu-item key="contact">
            <ContactsOutlined />
            Contact
          </a-menu-item>
          <a-menu-item key="admin" v-if="isAdmin">
            <SettingOutlined />
            Admin
          </a-menu-item>
        </a-menu>
      </a-drawer>
    </a-layout-header>

    <a-layout-content class="content" style="flex: 1;">
      <div class="content-wrapper">
        <slot />
      </div>
    </a-layout-content>

    <a-layout-footer class="footer">
      <div class="footer-content">
        <div class="footer-stats">
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Activități</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">Copii Înscriși</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">15+</div>
            <div class="stat-label">Ani Experiență</div>
          </div>
        </div>
        <div class="footer-info">
          <div class="footer-section">
            <p><strong>Adresă:</strong> Str. Albatrosului Nr. 11, Avantgarden, Bartolomeu, Brașov</p>
            <p><strong>Telefon:</strong> <a href="tel:0724428883">0724428883</a></p>
            <p>
              <a href="https://www.facebook.com/roselisportsiaventura/" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" style="vertical-align: middle;">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Roseli Sport & Aventură</span>
              </a>
            </p>
          </div>
        </div>
        <p>&copy; 2024 Roseli. Toate drepturile rezervate.</p>
        <div class="footer-badges">
          <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" class="anpc-badge">
            <img :src="anpcSalRoImage" alt="ANPC SAL" />
          </a>
          <a href="https://consumer-redress.ec.europa.eu/site-relocation_en?event=main.home.chooseLanguage" target="_blank" rel="noopener noreferrer" class="anpc-badge">
            <img :src="anpcSalEuImage" alt="ANPC SAL EU" />
          </a>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import {
  HomeOutlined,
  CarOutlined,
  FormOutlined,
  SettingOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  BookOutlined,
  PictureOutlined,
  NotificationOutlined,
  MenuOutlined,
  CloseOutlined,
  ContactsOutlined
} from '@ant-design/icons-vue'
import logoImage from '~/assets/photo/Roseli_logo.png'
import anpcSalRoImage from '~/assets/photo/apnc_sal_ro.png'
import anpcSalEuImage from '~/assets/photo/apnc_sol_eu.png'

const route = useRoute()
const router = useRouter()

const mobileMenuVisible = ref(false)

const selectedKeys = computed(() => {
  const routeName = route.name?.toString() || ''
  return [routeName.toLowerCase()]
})

const isAdmin = computed(() => {
  if (import.meta.client) {
    const token = localStorage.getItem('adminToken')
    const isOnPublicPage = ['home', 'trips', 'registration', 'camps', 'hikes', 'ski', 'swimming', 'school-offers', 'gallery', 'notice-board'].includes(route.name?.toString() || '')
    return !!token && !isOnPublicPage
  }
  return false
})

const navigateTo = (path: string) => {
  router.push(path)
  mobileMenuVisible.value = false
}

const handleMobileMenuClick = ({ key }: { key: string }) => {
  const routes: Record<string, string> = {
    'home': '/',
    'camps': '/camps',
    'hikes': '/hikes',
    'trips': '/trips',
    'ski': '/ski',
    'swimming': '/swimming',
    'school-offers': '/school-offers',
    'gallery': '/gallery',
    'notice-board': '/notice-board',
    'registration': '/registration',
    'contact': '/#contact',
    'admin': '/admin'
  }
  if (routes[key]) {
    navigateTo(routes[key])
  }
}

</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 0;
  position: relative;
  z-index: 1000;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  padding-left: var(--app-margin-desktop, 24px);
  padding-right: var(--app-margin-desktop, 24px);
  height: 100%;
  position: relative;
}

.mobile-menu-toggle {
  display: none;
  color: white !important;
  font-size: 20px;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  min-width: 40px;
  height: 40px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -10px;
}

.logo a {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.logo-image {
  height: 50px;
  width: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.logo-text {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  display: none;
}

@media (min-width: 769px) {
  .logo-text {
    display: block;
  }
}

@media (max-width: 768px) {
  .logo-image {
    height: 40px;
  }
}

.menu.desktop-menu {
  background: transparent;
  border: none;
  flex: 1;
  justify-content: flex-end;
}

.menu.desktop-menu :deep(.anticon) {
  margin-top: -6px !important;
  vertical-align: middle;
}

.mobile-menu-toggle :deep(.anticon) {
  margin-top: -6px !important;
  vertical-align: middle;
}

.content {
  min-height: calc(100vh - 64px - 120px);
  background: #f5f5f5;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  padding-left: var(--app-margin-desktop, 24px);
  padding-right: var(--app-margin-desktop, 24px);
}

.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 30px 0;
  margin-top: auto;
  width: 100%;
  position: relative;
  z-index: 10;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  padding-left: var(--app-margin-desktop, 24px);
  padding-right: var(--app-margin-desktop, 24px);
}

.footer-content {
  color: white;
}

.footer-content p {
  margin: 4px 0;
  color: white !important;
  opacity: 1;
}

.footer-content strong {
  color: white !important;
}

.footer-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  color: white;
  opacity: 0.9;
}

.footer-info {
  margin-bottom: 20px;
}

.footer-section {
  text-align: center;
  color: white;
}

.footer-section p {
  margin: 8px 0;
  color: white !important;
  opacity: 1;
}

.footer-section strong {
  color: white !important;
}

.footer-section a {
  color: white !important;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-section a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.footer-badges {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.anpc-badge {
  display: inline-block;
  transition: opacity 0.3s ease;
}

.anpc-badge:hover {
  opacity: 0.8;
}

.anpc-badge img {
  height: 50px;
  width: auto;
  object-fit: contain;
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

@media (max-width: 992px) {
  .mobile-menu-toggle {
    display: block;
  }
  
  .menu.desktop-menu {
    display: none;
  }
  
  .header-content {
    padding-left: var(--app-margin-tablet, 16px);
    padding-right: var(--app-margin-tablet, 16px);
  }

  .content-wrapper {
    padding: 16px;
    padding-left: var(--app-margin-tablet, 16px);
    padding-right: var(--app-margin-tablet, 16px);
  }

  .footer-content {
    padding-left: var(--app-margin-tablet, 16px);
    padding-right: var(--app-margin-tablet, 16px);
  }
}

@media (max-width: 768px) {
  .header-content {
    padding-left: var(--app-margin-mobile, 12px);
    padding-right: var(--app-margin-mobile, 12px);
  }
  
  .logo h2 {
    font-size: 1.2rem;
  }
  
  .content-wrapper {
    padding: 12px;
    padding-left: var(--app-margin-mobile, 12px);
    padding-right: var(--app-margin-mobile, 12px);
  }

  .footer-content {
    padding-left: var(--app-margin-mobile, 12px);
    padding-right: var(--app-margin-mobile, 12px);
  }
}
</style>

