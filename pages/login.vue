<template>
  <div class="login-page">
      <a-card class="login-card">
        <template #title>
          <h2>🔐 Autentificare Admin</h2>
        </template>
        
        <div class="login-content">
          <a-form
            :model="loginForm"
            :rules="rules"
            layout="vertical"
            @finish="handleLogin"
          >
            <a-form-item label="Nume utilizator" name="username">
              <a-input 
                v-model:value="loginForm.username" 
                placeholder="Introduceți numele de utilizator (admin)" 
                size="large"
              />
            </a-form-item>

            <a-form-item label="Parolă" name="password">
              <a-input-password 
                v-model:value="loginForm.password" 
                placeholder="Introduceți parola (admin)" 
                size="large"
              />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" block size="large">
                Autentificare
              </a-button>
            </a-form-item>
          </a-form>
          
          <div class="login-hint">
            <p>Utilizați: <strong>admin</strong> / <strong>admin</strong></p>
          </div>
        </div>
      </a-card>
    </div>
</template>

<script setup lang="ts">
// Exclude layout for login page to ensure consistent appearance
definePageMeta({
  layout: false
})

const router = useRouter()

const loading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: 'Vă rugăm să introduceți numele de utilizator' }],
  password: [{ required: true, message: 'Vă rugăm să introduceți parola' }]
}

// Check if already logged in on mount
onMounted(() => {
  if (import.meta.client) {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken === 'admin_token_here') {
      router.push('/admin')
    }
  }
})

// Username/password login
const handleLogin = async () => {
  loading.value = true
  try {
    // Simple authentication check
    if (loginForm.value.username === 'admin' && loginForm.value.password === 'admin') {
      // Store token
      if (import.meta.client) {
        localStorage.setItem('adminToken', 'admin_token_here')
        // Force full page reload to ensure middleware sees the token
        window.location.href = '/admin'
      }
    } else {
      alert('Credențiale invalide. Utilizați: admin / admin')
      loading.value = false
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('Autentificare eșuată. Vă rugăm să încercați din nou.')
    loading.value = false
  }
}
</script>

<style>
/* Global styles for login page - no layout */
body {
  margin: 0;
  padding: 0;
  background: #f0f2f5 !important;
}

.login-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #f0f2f5;
  margin: 0;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: white;
}

.login-card :deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

.login-card :deep(.ant-card-body) {
  padding: 24px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.login-content {
  padding: 8px 0;
}

.login-hint {
  margin-top: 16px;
  text-align: center;
  padding: 12px;
  background: #f0f2f5;
  border-radius: 8px;
}

.login-hint p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-hint strong {
  color: #2c3e50;
}
</style>


