import { getCollection } from '~/composables/useFirestore'
import { orderBy } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const hikes = await getCollection('hikes', [orderBy('name', 'asc')])
    return hikes
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch hikes'
    })
  }
})



