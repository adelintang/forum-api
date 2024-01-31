interface PayloadType {
  username: string
  id: string
}

interface AuthenticationTokenManagerType {
  createRefreshToken: (payload: PayloadType) => Promise<void>
  createAccessToken: (payload: PayloadType) => Promise<void>
  verifyRefreshToken: (token: string) => Promise<void>
  decodePayload: (token: string) => Promise<void>
}

interface AuthenticationRepositoryType {
  addToken: (token: string) => Promise<void>
  checkAvailabilityToken: (token: string) => Promise<void>
  deleteToken: (token: string) => Promise<void>
}

interface RefreshAuthenticationUseCaseType {
  authenticationRepository: AuthenticationRepositoryType
  authenticationTokenManager: AuthenticationTokenManagerType
}

class RefreshAuthenticationUseCase {
  _authenticationRepository: AuthenticationRepositoryType
  _authenticationTokenManager: AuthenticationTokenManagerType

  constructor ({
    authenticationRepository,
    authenticationTokenManager
  }: RefreshAuthenticationUseCaseType) {
    this._authenticationRepository = authenticationRepository
    this._authenticationTokenManager = authenticationTokenManager
  }

  async execute (useCasePayload: { refreshToken: string }): Promise<any> {
    this._verifyPayload(useCasePayload)
    const { refreshToken } = useCasePayload

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken)
    await this._authenticationRepository.checkAvailabilityToken(refreshToken)

    const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken) as string | any

    return await this._authenticationTokenManager.createAccessToken({ username, id })
  }

  _verifyPayload (payload: { refreshToken: string }): void {
    const { refreshToken } = payload

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default RefreshAuthenticationUseCase
