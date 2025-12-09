export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (import.meta.client) {
    const { getCurrentUser } = useAuth()
    
    // Wait longer for Firebase Auth state to sync (especially after login/redirect)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check Firebase Auth - try multiple times if needed
    let user = getCurrentUser()
    let attempts = 0
    while (!user && attempts < 3) {
      await new Promise(resolve => setTimeout(resolve, 200))
      user = getCurrentUser()
      attempts++
    }
    
    // Fallback to legacy token check
    const legacyToken = localStorage.getItem('adminToken')
    const isAuthenticated = !!user || !!legacyToken
    
    // If trying to access admin routes without authentication, redirect to login
    if (to.path.startsWith('/admin') && !isAuthenticated) {
      return navigateTo('/login')
    }
    
    // If logged in and trying to access login, redirect to admin
    if (to.path === '/login' && isAuthenticated) {
      return navigateTo('/admin')
    }
  }
})


