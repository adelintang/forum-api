import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import type { Container } from 'instances-container'
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase'
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase'
import LikeCommentUseCase from '../../../../Applications/use_case/LikeCommentUseCase'

class CommentsHandler {
  _container: Container

  constructor (container: Container) {
    this._container = container
  }

  async postCommentHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const { threadId } = request.params
    const { id: owner } = request.auth.credentials
    const { content }: any = request.payload

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const addedComment = await addCommentUseCase.execute({ threadId, owner, content })

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const { threadId, commentId } = request.params
    const { id: owner } = request.auth.credentials

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    await deleteCommentUseCase.execute({ threadId, commentId, owner })

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }

  async putLikeCommentHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const { threadId, commentId } = request.params
    const { id: owner } = request.auth.credentials

    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name)
    await likeCommentUseCase.execute({ threadId, commentId, owner })

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

export default CommentsHandler
