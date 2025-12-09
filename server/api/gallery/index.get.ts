import { getCollection } from '~/composables/useFirestore'
import { orderBy, where } from 'firebase/firestore'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const activityType = queryParams.activityType as string
    const activityId = queryParams.activityId as string

    const constraints: any[] = []

    // Add where clauses first (Firestore best practice)
    if (activityType && activityType !== '') {
      constraints.push(where('activityType', '==', activityType))
    }

    if (activityId && activityId !== '') {
      constraints.push(where('activityId', '==', activityId))
    }

    // Add orderBy last
    constraints.push(orderBy('createdAt', 'desc'))

    const gallery = await getCollection('gallery', constraints)
    return gallery
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch gallery items'
    })
  }
})



