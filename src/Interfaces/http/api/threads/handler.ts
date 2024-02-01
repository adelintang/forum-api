import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import type { Container } from 'instances-container'
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase'
import DetailThreadUseCase from '../../../../Applications/use_case/DetailThreadUseCase'

class ThreadsHandler {
  _container: Container

  constructor (container: Container) {
    this._container = container
  }

  async postThreadHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const { id: owner } = request.auth.credentials
    const { title, body }: any = request.payload

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute({ owner, title, body })

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getThreadHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const { threadId } = request.params

    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name)
    const detailThread = await detailThreadUseCase.execute({ threadId })

    const response = h.response({
      status: 'success',
      data: {
        ...detailThread
      }
    })
    response.code(200)
    return response
  }
}

export default ThreadsHandler
