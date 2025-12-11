<template>
  <a-layout>
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
            <img :src="logoImage" alt="Roseli - Sport & Aventură" class="logo-image" />
            <h2 class="logo-text">Roseli - Sport & Aventură</h2>
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
          <a-menu-item key="admin" v-if="isAdmin">
            <SettingOutlined />
            Admin
          </a-menu-item>
        </a-menu>
      </a-drawer>
    </a-layout-header>

    <a-layout-content class="content">
      <div class="content-wrapper">
        <slot />
      </div>
    </a-layout-content>

    <a-layout-footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Roseli - Sport & Aventură pentru Copii. Toate drepturile rezervate.</p>
        <p>Transport cu microbuze dotate cu climă pentru pasageri.</p>
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
  CloseOutlined
} from '@ant-design/icons-vue'
import logoImage from '~/assets/photo/logo.png'

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

.logo a {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-image {
  height: 50px;
  width: auto;
  object-fit: contain;
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

.content {
  min-height: calc(100vh - 64px - 70px);
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
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  padding-left: var(--app-margin-desktop, 24px);
  padding-right: var(--app-margin-desktop, 24px);
}

.footer-content p {
  margin: 4px 0;
  opacity: 0.9;
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

