import { getCollection } from '~/composables/useFirestore'
import { orderBy } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const offers = await getCollection('schoolOffers', [orderBy('createdAt', 'desc')])
    return offers
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch school offers'
    })
  }
})



