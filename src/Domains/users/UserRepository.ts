interface RegisterUserType {
  username: string
  password: string
  fullname: string
}

class UserRepository {
  async addUser (registerUser: RegisterUserType): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableUsername (username: string): Promise<void> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyUserExist (id: string): Promise<void> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getPasswordByUsername (username: string): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getIdByUsername (username: string): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

export default UserRepository
