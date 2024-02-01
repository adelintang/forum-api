import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import type { Container } from 'instances-container'
import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase'
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase'
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase'

class AuthenticationsHandler {
  _container: Container

  constructor (container: Container) {
    this._container = container
  }

  async postAuthenticationHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name)
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload)
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const refreshAuthenticationUseCase = this._container
      .getInstance(RefreshAuthenticationUseCase.name)
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        accessToken
      }
    })
    response.code(200)
    return response
  }

  async deleteAuthenticationHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name)
    await logoutUserUseCase.execute(request.payload)
    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

export default AuthenticationsHandler
