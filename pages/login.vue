<template>
  <div class="login-page">
      <a-card class="login-card">
        <template #title>
          <h2>🔐 Autentificare Admin</h2>
        </template>
        
        <div class="login-content">
          <a-button 
            type="primary" 
            :loading="loading" 
            block 
            size="large"
            @click="handleGoogleLogin"
            class="google-login-btn"
          >
            <template #icon>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </template>
            Autentificare cu Gmail
          </a-button>

          <a-divider>SAU</a-divider>

          <a-form
            :model="loginForm"
            :rules="rules"
            layout="vertical"
            @finish="handleLogin"
          >
            <a-form-item label="Nume utilizator" name="username">
              <a-input v-model:value="loginForm.username" placeholder="Introduceți numele de utilizator" />
            </a-form-item>

            <a-form-item label="Parolă" name="password">
              <a-input-password v-model:value="loginForm.password" placeholder="Introduceți parola" />
            </a-form-item>

            <a-form-item>
              <a-button type="default" html-type="submit" :loading="loading" block size="large">
                Autentificare
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { signInWithGoogle } = useAuth()

const loading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: 'Vă rugăm să introduceți numele de utilizator' }],
  password: [{ required: true, message: 'Vă rugăm să introduceți parola' }]
}

// Google Sign In
const handleGoogleLogin = async () => {
  loading.value = true
  try {
    const user = await signInWithGoogle()
    
    console.log('Google login successful, user:', user?.email)
    
    // Small delay to ensure everything is synced
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Use window.location for a full page reload to ensure auth state is properly checked
    if (window.location) {
      window.location.href = '/admin'
    } else {
      await navigateTo('/admin', { replace: true, external: false })
    }
  } catch (error: any) {
    console.error('Google login error:', error)
    loading.value = false
    
    let errorMessage = 'Autentificare eșuată. Vă rugăm să încercați din nou.'
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Fereastra de autentificare a fost închisă. Vă rugăm să încercați din nou.'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Fereastra de autentificare a fost blocată. Vă rugăm să permiteți popup-urile pentru acest site.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    alert(errorMessage)
  }
}

// Legacy username/password login (kept for backwards compatibility)
const handleLogin = async () => {
  loading.value = true
  try {
    // In a real app, this would call an authentication API
    // For now, we'll use a simple check
    if (loginForm.value.username === 'admin' && loginForm.value.password === 'admin123') {
      // Store token (in real app, this would come from the API)
      if (import.meta.client) {
        localStorage.setItem('adminToken', 'admin_token_here')
      }
      router.push('/admin')
    } else {
      alert('Credențiale invalide')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('Autentificare eșuată. Vă rugăm să încercați din nou.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 0;
  color: #2c3e50;
}

.login-content {
  padding: 8px 0;
}

.google-login-btn {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.google-login-btn svg {
  margin-right: 4px;
}
</style>


