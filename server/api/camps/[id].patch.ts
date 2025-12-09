import { updateDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Camp ID is required'
      })
    }
    
    await updateDocument('camps', id, body)
    
    return {
      message: 'Camp updated successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update camp'
    })
  }
})



