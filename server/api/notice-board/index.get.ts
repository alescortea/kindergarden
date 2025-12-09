import { getCollection } from '~/composables/useFirestore'
import { orderBy } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const notices = await getCollection('noticeBoard', [orderBy('createdAt', 'desc')])
    return notices
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notice board items'
    })
  }
})



