import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import type { Container } from 'instances-container'
import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase'

class UsersHandler {
  _container: Container

  constructor (container: Container) {
    this._container = container
  }

  async postUserHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name)
    const addedUser = await addUserUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedUser
      }
    })
    response.code(201)
    return response
  }
}

export default UsersHandler
