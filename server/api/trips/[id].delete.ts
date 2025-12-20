import { deleteDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Trip ID is required'
      })
    }
    
    await deleteDocument('trips', id)
    
    return {
      message: 'Trip deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete trip'
    })
  }
})


