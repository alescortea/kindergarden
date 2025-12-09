import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import { useFirebase } from './useFirebase'

// Helper function to get Firestore instance
const getDb = () => {
  try {
    const { db } = useFirebase()
    if (!db) {
      const error = new Error('Firestore not initialized. Check Firebase configuration and ensure Firestore is enabled in Firebase Console.')
      if (import.meta.server) {
        console.error('Firestore initialization error:', error.message)
      }
      throw error
    }
    return db
  } catch (error) {
    if (import.meta.server) {
      console.error('Error getting Firestore instance:', error)
    }
    throw error
  }
}

// Export direct functions for server-side usage
export const getCollection = async <T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const db = getDb()
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[]
}

export const getDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  const db = getDb()
  const docRef = doc(db, collectionName, documentId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return null
  
  return {
    id: docSnap.id,
    ...docSnap.data()
  } as T
}

export const createDocument = async <T = DocumentData>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string> => {
  const db = getDb()
  const collectionRef = collection(db, collectionName)
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  
  return docRef.id
}

export const updateDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  const db = getDb()
  const docRef = doc(db, collectionName, documentId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  const db = getDb()
  const docRef = doc(db, collectionName, documentId)
  await deleteDoc(docRef)
}

// Composable function for client-side usage (keeps backward compatibility)
export const useFirestore = () => {
  // Re-export the direct functions for convenience
  return {
    getCollection,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
  }
}


