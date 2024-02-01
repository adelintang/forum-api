import LoginUser from '../../Domains/users/entities/LoginUser'
import NewAuthentication from '../../Domains/authentications/entities/Auth'

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
  getIdByUsername: (username: string) => Promise<any>
}

interface PasswordHashType {
  hash: (password: string) => Promise<void>
  comparePassword: (plain: string, encrypted: string) => Promise<any>
}

interface PayloadType {
  username: string
  id: string
}

interface AuthenticationTokenManagerType {
  createRefreshToken: (payload: PayloadType) => Promise<any>
  createAccessToken: (payload: PayloadType) => Promise<any>
  verifyRefreshToken: (token: string) => Promise<void>
  decodePayload: () => Promise<void>
}

interface AuthenticationRepositoryType {
  addToken: (token: string) => Promise<void>
  checkAvailabilityToken: (token: string) => Promise<void>
  deleteToken: (token: string) => Promise<void>
}

interface LoginUserUseCaseType {
  userRepository: UserRepositoryType
  authenticationRepository: AuthenticationRepositoryType
  authenticationTokenManager: AuthenticationTokenManagerType
  passwordHash: PasswordHashType
}

interface NewAuthenticationType {
  accessToken: string
  refreshToken: string
}

class LoginUserUseCase {
  _userRepository: UserRepositoryType
  _authenticationRepository: AuthenticationRepositoryType
  _authenticationTokenManager: AuthenticationTokenManagerType
  _passwordHash: PasswordHashType

  constructor ({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash
  }: LoginUserUseCaseType) {
    this._userRepository = userRepository
    this._authenticationRepository = authenticationRepository
    this._authenticationTokenManager = authenticationTokenManager
    this._passwordHash = passwordHash
  }

  async execute (useCasePayload: { username: string, password: string }): Promise<NewAuthenticationType> {
    const { username, password } = new LoginUser(useCasePayload)

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username)

    await this._passwordHash.comparePassword(password, encryptedPassword as unknown as string)

    const id: string = await this._userRepository.getIdByUsername(username)

    const accessToken: string = await this._authenticationTokenManager
      .createAccessToken({ username, id })
    const refreshToken: string = await this._authenticationTokenManager
      .createRefreshToken({ username, id })

    const newAuthentication: NewAuthenticationType = new NewAuthentication({
      accessToken,
      refreshToken
    })

    await this._authenticationRepository.addToken(newAuthentication.refreshToken)

    return newAuthentication
  }
}

export default LoginUserUseCase
