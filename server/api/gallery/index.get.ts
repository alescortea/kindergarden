import { getCollection } from '~/composables/useFirestore'
import { orderBy, where } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const activityType = queryParams.activityType as string
    const activityId = queryParams.activityId as string

    const constraints = [orderBy('createdAt', 'desc')]

    if (activityType) {
      constraints.push(where('activityType', '==', activityType))
    }

    if (activityId) {
      constraints.push(where('activityId', '==', activityId))
    }

    const gallery = await getCollection('gallery', constraints)
    return gallery
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch gallery items'
    })
  }
})



