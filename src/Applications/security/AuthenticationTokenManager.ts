interface PayloadType {
  username: string
  id: string
}

class AuthenticationTokenManager {
  async createRefreshToken (payload: PayloadType): Promise<void> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async createAccessToken (payload: PayloadType): Promise<void> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async verifyRefreshToken (token: string): Promise<void> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async decodePayload (token: string): Promise<void> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }
}

export default AuthenticationTokenManager
