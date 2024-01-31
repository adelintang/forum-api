import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager'
import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase'

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

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 1
    }
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token'
    }
    const mockAuthenticationRepository: AuthenticationRepositoryType = new AuthenticationRepository()
    const mockAuthenticationTokenManager: AuthenticationTokenManagerType = new AuthenticationTokenManager()
    // Mocking
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve())
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve())
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(async () => await Promise.resolve({ username: 'dicoding', id: 'user-123' }))
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve('some_new_access_token'))
    // Create the use case instace
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager
    })

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(accessToken).toEqual('some_new_access_token')
  })
})
