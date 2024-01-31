import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase'

interface AuthenticationRepositoryType {
  addToken: (token: string) => Promise<void>
  checkAvailabilityToken: (token: string) => Promise<void>
  deleteToken: (token: string) => Promise<void>
}

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123
    }
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }
    const mockAuthenticationRepository: AuthenticationRepositoryType = new AuthenticationRepository()
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve())
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve())

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository
    })

    // Act
    await deleteAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})
