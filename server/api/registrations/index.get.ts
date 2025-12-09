import { getCollection } from '~/composables/useFirestore'
import { orderBy, where, query } from 'firebase/firestore'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const activityType = queryParams.activityType as string
    const status = queryParams.status as string

    const constraints = [orderBy('createdAt', 'desc')]

    if (activityType) {
      constraints.push(where('activityType', '==', activityType))
    }

    if (status) {
      constraints.push(where('status', '==', status))
    }

    const registrations = await getCollection('registrations', constraints)
    
    return registrations
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



