// @ts-ignore - firebase-admin is installed in Docker container
import admin from 'firebase-admin'

export function getAdmin() {
  if (!admin.apps.length) {
    const config = useRuntimeConfig()
    
    // Verifică dacă avem credentiale pentru Admin SDK
    if (config.firebaseAdminKey) {
      // Dacă avem un service account key JSON (string)
      try {
        const serviceAccount = typeof config.firebaseAdminKey === 'string' 
          ? JSON.parse(config.firebaseAdminKey) 
          : config.firebaseAdminKey
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: config.public.firebaseStorageBucket,
        })
        console.log('Firebase Admin initialized with service account key')
      } catch (error) {
        console.error('Error parsing Firebase Admin Key:', error)
        throw new Error('Invalid Firebase Admin Key format')
      }
    } else if (config.firebaseClientEmail && config.firebasePrivateKey) {
      // Dacă avem credentiale separate din runtime config
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebaseProjectId || process.env.FIREBASE_PROJECT_ID,
          clientEmail: config.firebaseClientEmail,
          privateKey: config.firebasePrivateKey?.replace(/\\n/g, '\n'),
        }),
        storageBucket: config.public.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET,
      })
      console.log('Firebase Admin initialized with separate credentials')
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      // Fallback la process.env direct
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebaseProjectId || process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: config.public.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET,
      })
      console.log('Firebase Admin initialized with separate credentials (from env)')
    } else {
      const errorMsg = 'Firebase Admin credentials not found. Please set FIREBASE_ADMIN_KEY (JSON string) or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env'
      console.error(errorMsg)
      throw new Error(errorMsg)
    }
  }
  return admin
}

