import { useFirebase } from '~/composables/useFirebase'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Check configuration
    const configStatus = {
      apiKey: !!config.public.firebaseApiKey,
      authDomain: !!config.public.firebaseAuthDomain,
      projectId: !!config.public.firebaseProjectId,
      storageBucket: !!config.public.firebaseStorageBucket,
      messagingSenderId: !!config.public.firebaseMessagingSenderId,
      appId: !!config.public.firebaseAppId,
    }
    
    // Try to initialize Firebase
    let firebaseStatus = 'not_initialized'
    let dbStatus = 'not_initialized'
    let errorMessage = null
    
    try {
      const { app, db } = useFirebase()
      firebaseStatus = app ? 'initialized' : 'failed'
      dbStatus = db ? 'initialized' : 'failed'
    } catch (error: any) {
      firebaseStatus = 'error'
      errorMessage = error?.message || String(error)
    }
    
    return {
      success: firebaseStatus === 'initialized' && dbStatus === 'initialized',
      config: {
        ...configStatus,
        projectId: config.public.firebaseProjectId,
      },
      firebase: {
        app: firebaseStatus,
        db: dbStatus,
      },
      error: errorMessage,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isServer: import.meta.server,
        isClient: import.meta.client,
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || String(error),
      stack: error?.stack
    }
  }
})

