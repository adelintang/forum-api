import RegisterUser from '../../Domains/users/entities/RegisterUser'

interface RegisterUserType {
  username: string
  password: string
  fullname: string
}

interface UserRepositoryType {
  addUser: (registerUser: RegisterUserType) => Promise<any>
  verifyAvailableUsername: (username: string) => Promise<void>
  verifyUserExist: (id: string) => Promise<void>
  getPasswordByUsername: (username: string) => Promise<void>
  getIdByUsername: (username: string) => Promise<void>
}

interface PasswordHashType {
  hash: (password: string) => Promise<any>
  comparePassword: (plain: string, encrypted: string) => Promise<void>
}

interface AddUserUseCaseType {
  userRepository: UserRepositoryType
  passwordHash: PasswordHashType
}

interface UseCasePayloadType {
  username: string
  password: string
  fullname: string
}

class AddUserUseCase {
  _userRepository: UserRepositoryType
  _passwordHash: PasswordHashType

  constructor ({ userRepository, passwordHash }: AddUserUseCaseType) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
  }

  async execute (useCasePayload: UseCasePayloadType): Promise<RegisterUserType> {
    const registerUser: UseCasePayloadType = new RegisterUser(useCasePayload)
    await this._userRepository.verifyAvailableUsername(registerUser.username)
    registerUser.password = await this._passwordHash.hash(registerUser.password)
    return await this._userRepository.addUser(registerUser)
  }
}

export default AddUserUseCase
