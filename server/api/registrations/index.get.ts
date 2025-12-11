import { getCollection } from '~/composables/useFirestore'
import { orderBy, where, query } from 'firebase/firestore'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const activityType = queryParams.activityType as string
    const status = queryParams.status as string

    const whereConstraints: any[] = []

    // Add where clauses first (Firestore best practice)
    if (activityType && activityType !== '') {
      whereConstraints.push(where('activityType', '==', activityType))
    }

    if (status && status !== '') {
      whereConstraints.push(where('status', '==', status))
    }

    // Try with orderBy first
    try {
      const constraintsWithOrder = [...whereConstraints, orderBy('createdAt', 'desc')]
      const registrations = await getCollection('registrations', constraintsWithOrder)
      return registrations
    } catch (orderByError: any) {
      // If orderBy fails (likely due to missing index), try without it and sort manually
      const errorMsg = orderByError?.message || String(orderByError)
      const errorCode = orderByError?.code || ''
      
      const isIndexError = 
        errorMsg.includes('index') || 
        errorMsg.includes('requires an index') || 
        errorMsg.includes('The query requires an index') ||
        errorCode === 'failed-precondition'
      
      if (isIndexError) {
        console.warn('Firestore index missing, fetching without orderBy and sorting manually')
        const registrations = await getCollection('registrations', whereConstraints)
        
        // Sort manually by createdAt descending
        const sorted = registrations.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
          return dateB.getTime() - dateA.getTime()
        })
        
        return sorted
      }
      
      // If it's not an index error, re-throw
      throw orderByError
    }
  } catch (error) {
    console.error('Registrations API Error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch registrations',
      data: {
        message: errorMessage,
        stack: errorStack
      }
    })
  }
})



