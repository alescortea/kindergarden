import { getCollection } from '~/composables/useFirestore'
import { orderBy, where } from 'firebase/firestore'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const year = queryParams.year as string
    const countyId = queryParams.countyId as string

    const constraints: any[] = []

    // Add where clauses first (Firestore best practice)
    if (year && year !== '') {
      const yearNum = parseInt(year)
      if (!isNaN(yearNum)) {
        constraints.push(where('year', '==', yearNum))
      }
    }

    if (countyId && countyId !== '') {
      // Filter by countyId
      constraints.push(where('countyId', '==', countyId))
    }

    // Add orderBy last
    constraints.push(orderBy('startDate', 'desc'))

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



