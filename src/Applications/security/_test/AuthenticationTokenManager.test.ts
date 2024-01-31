import AuthenticationTokenManager from '../AuthenticationTokenManager'

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const tokenManager = new AuthenticationTokenManager()

    // Action & Assert
    await expect(tokenManager.createAccessToken({
      username: '',
      id: ''
    })).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
    await expect(tokenManager.createRefreshToken({
      username: '',
      id: ''
    })).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
    await expect(tokenManager.decodePayload('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  })
})
