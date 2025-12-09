import { getCollection } from '~/composables/useFirestore'
import { orderBy, where } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const year = queryParams.year as string
    const location = queryParams.location as string

    const constraints = [orderBy('startDate', 'desc')]

    if (year) {
      constraints.push(where('year', '==', parseInt(year)))
    }

    if (location) {
      constraints.push(where('location', '==', location))
    }

    const camps = await getCollection('camps', constraints)
    
    return camps
  } catch (error) {
    console.error('Camps API Error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch camps',
      data: {
        message: errorMessage,
        stack: errorStack
      }
    })
  }
})



