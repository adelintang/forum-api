import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import type { Container } from 'instances-container'
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase'
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase'

class RepliesHandler {
  _container: Container

  constructor (container: Container) {
    this._container = container
  }

  async postReplyHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const { threadId, commentId } = request.params
    const { id: owner } = request.auth.credentials
    const { content }: any = request.payload

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name)
    const addedReply = await addReplyUseCase.execute({
      threadId, commentId, owner, content
    })

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const { threadId, commentId, replyId } = request.params
    const { id: owner } = request.auth.credentials

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name)
    await deleteReplyUseCase.execute({
      threadId, commentId, replyId, owner
    })

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

export default RepliesHandler
