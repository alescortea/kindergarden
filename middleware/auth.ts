export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server side (client-side auth only)
  if (import.meta.server) {
    return
  }
  
  // Only run on client side
  if (import.meta.client) {
    // Check for admin token in localStorage
    const adminToken = localStorage.getItem('adminToken')
    const isAuthenticated = !!adminToken && adminToken === 'admin_token_here'
    
    // If trying to access admin routes without authentication, redirect to login
    if (to.path.startsWith('/admin') && !isAuthenticated) {
      return navigateTo('/login')
    }
  }
})


