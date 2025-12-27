import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import type { FirebaseStorage } from 'firebase/storage'
import { useFirebase } from '~/composables/useFirebase'

// Helper function to get Storage instance
const getStorageInstance = () => {
  try {
    const { storage } = useFirebase()
    if (!storage) {
      console.error('Storage not initialized. Firebase config:', {
        isServer: import.meta.server,
        isClient: import.meta.client
      })
      throw new Error('Storage not initialized')
    }
    return storage
  } catch (error) {
    console.error('Error getting storage instance:', error)
    throw error
  }
}

// Export direct functions for server-side usage
export const uploadFile = async (
  path: string,
  file: File,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<string> => {
  const storage = getStorageInstance()
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file, metadata)
  const downloadURL = await getDownloadURL(snapshot.ref)
  
  return downloadURL
}

export const uploadImage = async (
  folder: string,
  file: File,
  fileName?: string
): Promise<string> => {
  const name = fileName || `${Date.now()}_${file.name}`
  const path = `${folder}/${name}`
  
  return uploadFile(path, file, {
    contentType: file.type || 'image/jpeg',
  })
}

export const uploadVideo = async (
  folder: string,
  file: File,
  fileName?: string
): Promise<string> => {
  const name = fileName || `${Date.now()}_${file.name}`
  const path = `${folder}/${name}`
  
  return uploadFile(path, file, {
    contentType: file.type || 'video/mp4',
  })
}

export const deleteFile = async (path: string): Promise<void> => {
  const storage = getStorageInstance()
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

export const getFileURL = async (path: string): Promise<string> => {
  const storage = getStorageInstance()
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

// Composable function for client-side usage (keeps backward compatibility)
export const useStorage = () => {
  return {
    uploadFile,
    uploadImage,
    uploadVideo,
    deleteFile,
    getFileURL,
  }
}


