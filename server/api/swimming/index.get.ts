import { getCollection } from '~/composables/useFirestore'
import { orderBy } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const lessons = await getCollection('swimmingLessons', [orderBy('createdAt', 'desc')])
    return lessons
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch swimming lessons'
    })
  }
})



