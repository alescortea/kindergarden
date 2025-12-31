import { updateDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Swimming lesson ID is required'
      })
    }
    
    await updateDocument('swimmingLessons', id, body)
    
    return {
      message: 'Swimming lesson updated successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update swimming lesson'
    })
  }
})



