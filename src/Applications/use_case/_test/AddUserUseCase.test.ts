import RegisterUser from '../../../Domains/users/entities/RegisterUser'
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser'
import UserRepository from '../../../Domains/users/UserRepository'
import PasswordHash from '../../security/PasswordHash'
import AddUserUseCase from '../AddUserUseCase'

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

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    })

    /** creating dependency of use case */
    const mockUserRepository: UserRepositoryType = new UserRepository()
    const mockPasswordHash: PasswordHashType = new PasswordHash()

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(async () => await Promise.resolve())
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(async () => await Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(async () => await Promise.resolve(mockRegisteredUser))

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    }))

    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname
    }))
  })
})
