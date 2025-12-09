import { getCollection } from '~/composables/useFirestore'
import { orderBy, where } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const type = queryParams.type as string

    const constraints = [orderBy('createdAt', 'desc')]

    if (type) {
      constraints.push(where('type', '==', type))
    }

    const skiLessons = await getCollection('skiLessons', constraints)
    return skiLessons
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch ski lessons'
    })
  }
})



