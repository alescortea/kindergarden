import { getCollection } from '~/composables/useFirestore'
import { orderBy, where } from 'firebase/firestore'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const type = queryParams.type as string

    const constraints: any[] = []

    // Add where clauses first (Firestore best practice)
    if (type && type !== '') {
      constraints.push(where('type', '==', type))
    }

    // Add orderBy last
    constraints.push(orderBy('createdAt', 'desc'))

    const skiLessons = await getCollection('skiLessons', constraints)
    return skiLessons
  } catch (error) {
    console.error('Ski API Error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch ski lessons',
      data: {
        message: errorMessage,
        stack: errorStack
      }
    })
  }
})



