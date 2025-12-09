<template>
  <div class="admin-page">
      <div class="admin-header">
        <div class="header-content">
          <h1>⚙️ Panou Admin</h1>
          <p>Gestionează toate activitățile, înscrierile și conținutul</p>
        </div>
        <div class="header-actions">
          <a-button @click="logout" danger>
            <LogoutOutlined />
            Deconectare
          </a-button>
        </div>
      </div>

      <div class="admin-tabs">
        <div class="tabs-header">
          <a-button 
            v-for="tab in tabs" 
            :key="tab.key"
            :type="activeTab === tab.key ? 'primary' : 'default'"
            @click="activeTab = tab.key"
            class="tab-button"
          >
            {{ tab.label }}
          </a-button>
        </div>
        <div class="tabs-content">
          <AdminRegistrations v-if="activeTab === 'registrations'" />
          <AdminCamps v-else-if="activeTab === 'camps'" />
          <AdminHikes v-else-if="activeTab === 'hikes'" />
          <AdminTrips v-else-if="activeTab === 'trips'" />
          <AdminSki v-else-if="activeTab === 'ski'" />
          <AdminSwimming v-else-if="activeTab === 'swimming'" />
          <AdminSchoolOffers v-else-if="activeTab === 'school-offers'" />
          <AdminGallery v-else-if="activeTab === 'gallery'" />
          <AdminNoticeBoard v-else-if="activeTab === 'notice-board'" />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { LogoutOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const { signOut, getCurrentUser, user } = useAuth()

const activeTab = ref('registrations')

const tabs = [
  { key: 'registrations', label: '📋 Înscrieri' },
  { key: 'camps', label: '🏕️ Tabere' },
  { key: 'hikes', label: '🥾 Drumeții' },
  { key: 'trips', label: '🗺️ Excursii' },
  { key: 'ski', label: '⛷️ Lecții de Ski' },
  { key: 'swimming', label: '🏊 Lecții de Înot' },
  { key: 'school-offers', label: '🏫 Oferte Școlare' },
  { key: 'gallery', label: '📸 Galerie' },
  { key: 'notice-board', label: '📋 Anunțuri' }
]

const logout = async () => {
  try {
    // Sign out from Firebase Auth
    await signOut()
    
    // Also remove legacy token if exists
    if (import.meta.client) {
      localStorage.removeItem('adminToken')
    }
    
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Even if Firebase logout fails, clear local storage and redirect
    if (import.meta.client) {
      localStorage.removeItem('adminToken')
    }
    router.push('/login')
  }
}

// Check authentication with retry logic
onMounted(async () => {
  if (import.meta.client) {
    // Wait a bit for Firebase Auth to sync after page load
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let currentUser = getCurrentUser()
    let attempts = 0
    
    // Try multiple times to get the user (Firebase Auth might need time to sync)
    while (!currentUser && attempts < 3) {
      await new Promise(resolve => setTimeout(resolve, 200))
      currentUser = getCurrentUser()
      attempts++
    }
    
    const legacyToken = localStorage.getItem('adminToken')
    
    // If neither Firebase Auth nor legacy token exists, redirect to login
    if (!currentUser && !legacyToken) {
      console.warn('No authentication found, redirecting to login')
      router.push('/login')
    } else {
      console.log('Authentication verified:', currentUser?.email || 'legacy token')
    }
  }
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.header-content h1 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  margin-top: 0;
}

.header-content p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.admin-tabs {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.tabs-header {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.tab-button {
  margin-right: 8px;
}

.tabs-content {
  min-height: 400px;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .header-actions .ant-btn {
    width: 100%;
  }
}
</style>


