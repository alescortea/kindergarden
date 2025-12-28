// @ts-ignore - firebase-admin is installed in Docker container
import admin from 'firebase-admin'

/**
 * Get Firebase Storage bucket
 * - În Cloud Run: folosește Service Account-ul implicit
 * - Local: folosește credentialele din .env (FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY sau FIREBASE_ADMIN_KEY)
 */
export function getBucket() {
  if (!admin.apps.length) {
    const config = useRuntimeConfig()
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'kindergarden-website.firebasestorage.app'
    
    // Detectează dacă suntem în Cloud Run
    const isCloudRun = !!process.env.K_SERVICE || !!process.env.GOOGLE_CLOUD_PROJECT
    
    console.log('[firebaseAdmin] Initializing Firebase Admin SDK...')
    console.log('[firebaseAdmin] Environment:', isCloudRun ? 'Cloud Run' : 'Local')
    console.log('[firebaseAdmin] Storage bucket:', storageBucket)
    
    if (isCloudRun) {
      // În Cloud Run, Admin SDK folosește automat Service Account-ul configurat
      admin.initializeApp({
        storageBucket,
      })
      console.log('[firebaseAdmin] Firebase Admin initialized with Service Account from Cloud Run')
    } else {
      // Local: folosește credentialele din .env
      if (config.firebaseAdminKey) {
        // Dacă avem un service account key JSON (string)
        try {
          console.log('[firebaseAdmin] Using FIREBASE_ADMIN_KEY for local development')
          const serviceAccount = typeof config.firebaseAdminKey === 'string' 
            ? JSON.parse(config.firebaseAdminKey) 
            : config.firebaseAdminKey
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket,
          })
          console.log('[firebaseAdmin] Firebase Admin initialized with service account key')
        } catch (error: any) {
          console.error('[firebaseAdmin] Error parsing Firebase Admin Key:', error?.message)
          throw new Error(`Invalid Firebase Admin Key format: ${error?.message}`)
        }
      } else if (config.firebaseClientEmail && config.firebasePrivateKey) {
        // Dacă avem credentiale separate din runtime config
        console.log('[firebaseAdmin] Using FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY for local development')
        const projectId = config.firebaseProjectId || process.env.FIREBASE_PROJECT_ID
        
        if (!projectId) {
          throw new Error('Missing FIREBASE_PROJECT_ID for local development')
        }
        
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail: config.firebaseClientEmail,
            privateKey: config.firebasePrivateKey?.replace(/\\n/g, '\n'),
          }),
          storageBucket,
        })
        console.log('[firebaseAdmin] Firebase Admin initialized with separate credentials')
      } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        // Fallback la process.env direct
        console.log('[firebaseAdmin] Using FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY from process.env for local development')
        const projectId = process.env.FIREBASE_PROJECT_ID
        
        if (!projectId) {
          throw new Error('Missing FIREBASE_PROJECT_ID in environment variables for local development')
        }
        
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
          storageBucket,
        })
        console.log('[firebaseAdmin] Firebase Admin initialized with separate credentials (from env)')
      } else {
        const errorMsg = 'Firebase Admin credentials not found for local development. Please set FIREBASE_ADMIN_KEY (JSON string) or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env'
        console.error('[firebaseAdmin]', errorMsg)
        throw new Error(errorMsg)
      }
    }
  } else {
    console.log('[firebaseAdmin] Firebase Admin already initialized, reusing existing instance')
  }
  
  return admin.storage().bucket()
}
