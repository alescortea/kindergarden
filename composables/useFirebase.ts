import { initializeApp, getApps } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import type { FirebaseStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'
import type { Analytics } from 'firebase/analytics'

export const useFirebase = () => {
  // useRuntimeConfig is auto-imported in Nuxt 3
  // @ts-ignore - Auto-imported by Nuxt
  const config = useRuntimeConfig()
  
  let app: FirebaseApp | null = null
  let db: Firestore | null = null
  let storage: FirebaseStorage | null = null
  let auth: Auth | null = null
  let analytics: Analytics | null = null

  // Validate Firebase configuration
  if (!config.public.firebaseApiKey || !config.public.firebaseProjectId) {
    const error = new Error('Firebase configuration is missing. Please check your environment variables.')
    if (import.meta.server) {
      console.error('Firebase Config Error:', {
        apiKey: config.public.firebaseApiKey ? 'present' : 'missing',
        projectId: config.public.firebaseProjectId ? 'present' : 'missing',
        authDomain: config.public.firebaseAuthDomain ? 'present' : 'missing',
        storageBucket: config.public.firebaseStorageBucket ? 'present' : 'missing',
        appId: config.public.firebaseAppId ? 'present' : 'missing',
      })
    }
    throw error
  }

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    ...(config.public.firebaseMeasurementId && { measurementId: config.public.firebaseMeasurementId }),
  }

  // Initialize Firebase only if not already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  db = getFirestore(app)
  storage = getStorage(app)
  
  // Auth and Analytics only work on client-side
  if (import.meta.client) {
    auth = getAuth(app)
    
    // Initialize Analytics if supported and measurementId is provided
    if (config.public.firebaseMeasurementId) {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app)
        }
      })
    }
  }

  return {
    app,
    db,
    storage,
    auth,
    analytics
  }
}


