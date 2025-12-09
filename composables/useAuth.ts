import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import type { Auth } from 'firebase/auth'

// Get Firebase Auth instance
const getAuthInstance = (): Auth => {
  const { auth } = useFirebase()
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Make sure you are on the client side.')
  }
  return auth
}

// Google Sign In
export const signInWithGoogle = async (): Promise<User> => {
  if (!import.meta.client) {
    throw new Error('Authentication is only available on the client side')
  }

  const auth = getAuthInstance()
  const provider = new GoogleAuthProvider()
  
  try {
    const result = await signInWithPopup(auth, provider)
    
    // Wait for auth state to be fully updated using onAuthStateChanged
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        if (user) {
          resolve(user)
        } else {
          // Fallback: use result.user if available
          if (result.user) {
            resolve(result.user)
          } else {
            reject(new Error('Authentication succeeded but user not found'))
          }
        }
      }, (error) => {
        unsubscribe()
        // If there's an error but we have result.user, still resolve
        if (result.user) {
          resolve(result.user)
        } else {
          reject(error)
        }
      })
      
      // Timeout fallback - if auth state doesn't change in 2 seconds, use result.user
      setTimeout(() => {
        unsubscribe()
        if (result.user) {
          resolve(result.user)
        } else if (auth.currentUser) {
          resolve(auth.currentUser)
        } else {
          reject(new Error('Authentication timeout'))
        }
      }, 2000)
    })
  } catch (error: any) {
    console.error('Google sign in error:', error)
    throw error
  }
}

// Sign Out
export const signOutUser = async (): Promise<void> => {
  if (!import.meta.client) {
    return
  }

  const auth = getAuthInstance()
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  if (!import.meta.client) {
    return null
  }

  const auth = getAuthInstance()
  return auth.currentUser
}

// Watch auth state changes
export const useAuthState = () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  if (import.meta.client) {
    const auth = getAuthInstance()
    
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  } else {
    loading.value = false
  }

  return {
    user: readonly(user),
    loading: readonly(loading)
  }
}

// Composable for easy access
export const useAuth = () => {
  const { user, loading } = useAuthState()

  return {
    user,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
    getCurrentUser,
    isAuthenticated: computed(() => !!user.value)
  }
}

