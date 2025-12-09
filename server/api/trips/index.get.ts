import { getCollection } from '~/composables/useFirestore'
import { orderBy } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const trips = await getCollection('trips', [orderBy('name', 'asc')])
    return trips
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch trips'
    })
  }
})



