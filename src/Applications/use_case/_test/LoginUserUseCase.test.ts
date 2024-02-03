import UserRepository from '../../../Domains/users/UserRepository'
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager'
import PasswordHash from '../../security/PasswordHash'
import LoginUserUseCase from '../LoginUserUseCase'
import NewAuth from '../../../Domains/authentications/entities/Auth'

interface RegisterUserType {
  username: string
  password: string
  fullname: string
}

interface UserRepositoryType {
  addUser: (registerUser: RegisterUserType) => Promise<void>
  verifyAvailableUsername: (username: string) => Promise<void>
  verifyUserExist: (id: string) => Promise<void>
  getPasswordByUsername: (username: string) => Promise<void>
  getIdByUsername: (username: string) => Promise<void>
}

interface PasswordHashType {
  hash: (password: string) => Promise<void>
  comparePassword: (plain: string, encrypted: string) => Promise<void>
}

interface PayloadType {
  username: string
  id: string
}

interface AuthenticationTokenManagerType {
  createRefreshToken: (payload: PayloadType) => Promise<void>
  createAccessToken: (payload: PayloadType) => Promise<void>
  verifyRefreshToken: (token: string) => Promise<void>
  decodePayload: () => Promise<void>
}

interface AuthenticationRepositoryType {
  addToken: (token: string) => Promise<void>
  checkAvailabilityToken: (token: string) => Promise<void>
  deleteToken: (token: string) => Promise<void>
}

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret'
    }
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })
    const mockUserRepository: UserRepositoryType = new UserRepository()
    const mockAuthenticationRepository: AuthenticationRepositoryType = new AuthenticationRepository()
    const mockAuthenticationTokenManager: AuthenticationTokenManagerType | any = new AuthenticationTokenManager()
    const mockPasswordHash: PasswordHashType = new PasswordHash()

    // Mocking
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(async () => await Promise.resolve('encrypted_password'))
    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(async () => await Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve(mockedAuthentication.accessToken))
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve(mockedAuthentication.refreshToken))
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(async () => await Promise.resolve('user-123'))
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve())

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash
    })

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    }))
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith('dicoding')
    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith('secret', 'encrypted_password')
    expect(mockUserRepository.getIdByUsername)
      .toBeCalledWith('dicoding')
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(mockedAuthentication.refreshToken)
  })
})
