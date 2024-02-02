import { type Pool } from 'pg'
import InvariantError from '../../Commons/exceptions/InvariantError'
import RegisteredUser from '../../Domains/users/entities/RegisteredUser'
import UserRepository from '../../Domains/users/UserRepository'

interface RegisterUserType {
  username: string
  password: string
  fullname: string
}

interface QueryResult<T> {
  rowCount: any
  rows: T[]
}

interface AddUserReturnType {
  id: string
  username: string
  fullname: string
}

class UserRepositoryPostgres extends UserRepository {
  _pool: Pool
  _idGenerator: any
  constructor (pool: Pool, idGenerator: any) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async verifyAvailableUsername (username: string): Promise<void> {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia')
    }
  }

  async addUser (registerUser: RegisterUserType): Promise<AddUserReturnType> {
    const { username, password, fullname } = registerUser
    const id = `user-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname]
    }

    const result: QueryResult<AddUserReturnType> = await this._pool.query(query)

    return new RegisteredUser({ ...result.rows[0] })
  }

  async verifyUserExist (id: string): Promise<void> {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan')
    }
  }

  async getPasswordByUsername (username: string): Promise<string> {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan')
    }

    return result.rows[0].password
  }

  async getIdByUsername (username: string): Promise<string> {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan')
    }

    const { id } = result.rows[0]

    return id
  }
}

export default UserRepositoryPostgres
