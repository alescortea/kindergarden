import { deleteDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'School offer ID is required'
      })
    }
    
    await deleteDocument('schoolOffers', id)
    
    return {
      message: 'School offer deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete school offer'
    })
  }
})

