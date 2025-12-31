import { 
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
    signOut: signOutUser,
    getCurrentUser,
    isAuthenticated: computed(() => !!user.value)
  }
}

