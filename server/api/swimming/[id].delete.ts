import { deleteDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Swimming lesson ID is required'
      })
    }
    
    await deleteDocument('swimmingLessons', id)
    
    return {
      message: 'Swimming lesson deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete swimming lesson'
    })
  }
})


