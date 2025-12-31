// @ts-ignore - firebase-admin is installed in Docker container
import admin from 'firebase-admin'

/**
 * Format private key correctly for Firebase Admin SDK
 * Handles multiple formats: \\n (from .env), \n (after Node.js reads), and actual newlines
 */
function formatPrivateKey(privateKey: string): string {
  if (!privateKey) {
    throw new Error('Private key is empty')
  }
  
  // Elimină ghilimele dacă există
  let formatted = privateKey.trim()
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || 
      (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1)
  }
  
  // Înlocuiește toate variantele de newline escape-uri
  // \\n (două backslash-uri din .env) -> \n
  // \n (un backslash după ce Node.js citește) -> \n
  formatted = formatted.replace(/\\\\n/g, '\n')  // Două backslash-uri
  formatted = formatted.replace(/\\n/g, '\n')     // Un backslash
  
  // Asigură-te că cheia începe cu -----BEGIN PRIVATE KEY-----
  if (!formatted.includes('BEGIN PRIVATE KEY') && !formatted.includes('BEGIN RSA PRIVATE KEY')) {
    throw new Error('Invalid private key format: missing BEGIN PRIVATE KEY header')
  }
  
  // Asigură-te că cheia se termină cu -----END PRIVATE KEY-----
  if (!formatted.includes('END PRIVATE KEY') && !formatted.includes('END RSA PRIVATE KEY')) {
    throw new Error('Invalid private key format: missing END PRIVATE KEY footer')
  }
  
  return formatted
}

/**
 * Get Firebase Storage bucket
 * - În Cloud Run: folosește Service Account-ul implicit (NU folosește credentiale din env vars)
 * - Pe VPS: folosește GOOGLE_APPLICATION_CREDENTIALS (fișier JSON)
 * - Local: folosește credentialele din .env (FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY sau FIREBASE_ADMIN_KEY)
 */
export function getBucket() {
  if (!admin.apps.length) {
    const config = useRuntimeConfig()
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'kindergarden-website.firebasestorage.app'
    
    // Detectează dacă suntem în Cloud Run
    const isCloudRun = !!process.env.K_SERVICE
    
    // Detectează dacă avem GOOGLE_APPLICATION_CREDENTIALS (VPS cu fișier JSON)
    const hasGoogleCredentials = !!process.env.GOOGLE_APPLICATION_CREDENTIALS
    
    console.log('[firebaseAdmin] Initializing Firebase Admin SDK...')
    console.log('[firebaseAdmin] Storage bucket:', storageBucket)
    console.log('[firebaseAdmin] K_SERVICE:', process.env.K_SERVICE || 'not set')
    console.log('[firebaseAdmin] GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS || 'not set')
    console.log('[firebaseAdmin] GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT || 'not set')
    
    // Verifică mai întâi GOOGLE_APPLICATION_CREDENTIALS (prioritate pentru VPS/Docker)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        console.log('[firebaseAdmin] Using GOOGLE_APPLICATION_CREDENTIALS')
        console.log('[firebaseAdmin] Credentials file:', process.env.GOOGLE_APPLICATION_CREDENTIALS)
        
        // Firebase Admin SDK va detecta automat GOOGLE_APPLICATION_CREDENTIALS
        admin.initializeApp({
          storageBucket,
        })
        
        console.log('[firebaseAdmin] Firebase Admin initialized with GOOGLE_APPLICATION_CREDENTIALS')
        
        const bucket = admin.storage().bucket()
        console.log('[firebaseAdmin] Storage bucket retrieved successfully:', bucket.name)
        return bucket
      } catch (error: any) {
        console.error('[firebaseAdmin] Error initializing with GOOGLE_APPLICATION_CREDENTIALS:', error?.message)
        console.error('[firebaseAdmin] Error code:', error?.code)
        console.error('[firebaseAdmin] Error name:', error?.name)
        console.error('[firebaseAdmin] Error stack:', error?.stack)
        
        const errorMessage = error?.message || 'Unknown error'
        throw new Error(`Firebase Storage bucket initialization failed: ${errorMessage}. Make sure GOOGLE_APPLICATION_CREDENTIALS points to a valid service account JSON file and the file has correct permissions.`)
      }
    } else if (isCloudRun) {
      // În Cloud Run, Admin SDK folosește automat Service Account-ul configurat
      // IMPORTANT: Nu folosim credentiale din env vars pe Cloud Run, chiar dacă există
      try {
        console.log('[firebaseAdmin] Attempting to initialize with Cloud Run Service Account...')
        console.log('[firebaseAdmin] Project ID from env:', process.env.GOOGLE_CLOUD_PROJECT)
        
        // Încearcă să inițializeze fără credentiale explicite (folosește Service Account implicit)
        admin.initializeApp({
          storageBucket,
        })
        
        console.log('[firebaseAdmin] Firebase Admin initialized with Service Account from Cloud Run')
        console.log('[firebaseAdmin] Using implicit Service Account credentials')
        
        // Testează dacă bucket-ul este accesibil
        const testBucket = admin.storage().bucket()
        console.log('[firebaseAdmin] Test bucket name:', testBucket.name)
      } catch (error: any) {
        console.error('[firebaseAdmin] Error initializing with Cloud Run Service Account:', error?.message)
        console.error('[firebaseAdmin] Error code:', error?.code)
        console.error('[firebaseAdmin] Error name:', error?.name)
        console.error('[firebaseAdmin] Error stack:', error?.stack)
        
        // Dacă Service Account-ul implicit nu funcționează, verifică IAM permissions
        const errorMessage = error?.message || 'Unknown error'
        throw new Error(`Firebase Storage bucket initialization failed: ${errorMessage}. Make sure the Cloud Run service account has 'Storage Object Admin' or 'Storage Admin' role for Firebase Storage.`)
      }
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
        
        try {
          const formattedPrivateKey = formatPrivateKey(config.firebasePrivateKey)
          
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail: config.firebaseClientEmail,
              privateKey: formattedPrivateKey,
            }),
            storageBucket,
          })
          console.log('[firebaseAdmin] Firebase Admin initialized with separate credentials')
        } catch (error: any) {
          console.error('[firebaseAdmin] Error initializing with separate credentials:', error?.message)
          throw new Error(`Failed to parse private key: ${error?.message}`)
        }
      } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        // Fallback la process.env direct
        console.log('[firebaseAdmin] Using FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY from process.env for local development')
        const projectId = process.env.FIREBASE_PROJECT_ID
        
        if (!projectId) {
          throw new Error('Missing FIREBASE_PROJECT_ID in environment variables for local development')
        }
        
        try {
          const formattedPrivateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY)
          
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: formattedPrivateKey,
            }),
            storageBucket,
          })
          console.log('[firebaseAdmin] Firebase Admin initialized with separate credentials (from env)')
        } catch (error: any) {
          console.error('[firebaseAdmin] Error initializing with separate credentials (from env):', error?.message)
          throw new Error(`Failed to parse private key: ${error?.message}`)
        }
      } else {
        const errorMsg = 'Firebase Admin credentials not found for local development. Please set FIREBASE_ADMIN_KEY (JSON string) or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env'
        console.error('[firebaseAdmin]', errorMsg)
        throw new Error(errorMsg)
      }
    }
  } else {
    console.log('[firebaseAdmin] Firebase Admin already initialized, reusing existing instance')
  }
  
  try {
    const bucket = admin.storage().bucket()
    console.log('[firebaseAdmin] Storage bucket retrieved successfully:', bucket.name)
    
    // Verify that we can access the bucket (this will fail if permissions are wrong)
    if (!bucket.name) {
      throw new Error('Bucket name is empty - Firebase Admin SDK may not be properly initialized')
    }
    
    return bucket
  } catch (error: any) {
    console.error('[firebaseAdmin] Error getting storage bucket:', error?.message)
    console.error('[firebaseAdmin] Error code:', error?.code)
    console.error('[firebaseAdmin] Error name:', error?.name)
    
    // Provide more helpful error messages
    if (error?.code === 'PERMISSION_DENIED' || error?.message?.includes('permission')) {
      throw new Error(`Permission denied accessing Firebase Storage. Make sure the Cloud Run service account has 'Storage Object Admin' role. Original error: ${error?.message}`)
    }
    
    throw new Error(`Failed to get storage bucket: ${error?.message || 'Unknown error'}`)
  }
}
