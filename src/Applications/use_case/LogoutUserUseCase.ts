interface AuthenticationRepositoryType {
  addToken: (token: string) => Promise<void>
  checkAvailabilityToken: (token: string) => Promise<void>
  deleteToken: (token: string) => Promise<void>
}

class LogoutUserUseCase {
  _authenticationRepository: AuthenticationRepositoryType

  constructor ({
    authenticationRepository
  }: { authenticationRepository: AuthenticationRepositoryType }) {
    this._authenticationRepository = authenticationRepository
  }

  async execute (useCasePayload: { refreshToken: string }): Promise<void> {
    this._validatePayload(useCasePayload)
    const { refreshToken } = useCasePayload
    await this._authenticationRepository.checkAvailabilityToken(refreshToken)
    await this._authenticationRepository.deleteToken(refreshToken)
  }

  _validatePayload (payload: { refreshToken: string }): void {
    const { refreshToken } = payload
    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default LogoutUserUseCase
