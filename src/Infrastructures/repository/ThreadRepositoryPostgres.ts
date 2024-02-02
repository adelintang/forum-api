import { type Pool } from 'pg'
import NotFoundError from '../../Commons/exceptions/NotFoundError'
import ThreadRepository from '../../Domains/threads/ThreadRepository'
import AddedThread from '../../Domains/threads/entities/AddedThread'
import Thread from '../../Domains/threads/entities/Thread'

interface AddThreadType {
  owner: string
  title: string
  body: string
}

interface AddThreadResultType {
  id: string
  title: string
  owner: string
}

interface QueryResult<T> {
  rowCount: any
  rows: T[]
}

interface GetThreadByIdResultType {
  id: string
  body: string
  title: string
  date: string
  username: string
}

interface GetThreadByIdReturnType {
  id: string
  title: string
  body: string
  date: string
  username: string
}

class ThreadRepositoryPostgres extends ThreadRepository {
  _pool: Pool
  _idGenerator: any
  constructor (pool: Pool, idGenerator: any) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread ({ owner, title, body }: AddThreadType): Promise<AddThreadResultType> {
    const id = `thread-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, owner, title, body, date]
    }

    const result: QueryResult<AddThreadResultType> = await this._pool.query(query)
    const rows = result.rows[0]

    return new AddedThread(rows)
  }

  async verifyThreadExists (id: string): Promise<void> {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
  }

  async getThreadById (id: string): Promise<GetThreadByIdReturnType> {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
      FROM threads LEFT JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [id]
    }

    const result: QueryResult<GetThreadByIdResultType> = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    const rows = result.rows[0]
    const thread = new Thread(rows)

    return thread
  }
}

export default ThreadRepositoryPostgres
