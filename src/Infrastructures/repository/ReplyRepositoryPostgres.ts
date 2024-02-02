import { type Pool } from 'pg'
import AuthorizationError from '../../Commons/exceptions/AuthorizationError'
import NotFoundError from '../../Commons/exceptions/NotFoundError'
import Reply from '../../Domains/replies/entities/Reply'
import AddedReply from '../../Domains/replies/entities/AddedReply'
import ReplyRepository from '../../Domains/replies/ReplyRepository'

interface AddReplyType {
  commentId: string
  owner: string
  content: string
}

interface AddReplyResultType {
  id: string
  owner: string
  content: string
}

interface QueryResult<T> {
  rows: T[]
}

interface RepliesByIdType {
  id: string
  comment_id: string
  date: string
  content: string
  is_delete: string
  username: string
}

interface GetRepliesByThreadIdType {
  id: string
  username: string
  date: string
  content: string
  commentId: string
}

class ReplyRepositoryPostgres extends ReplyRepository {
  _pool: Pool
  _idGenerator: any
  constructor (pool: Pool, idGenerator: any) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply ({ commentId, owner, content }: AddReplyType): Promise<AddReplyResultType> {
    const id = `reply-${this._idGenerator()}`
    const date = new Date().toISOString()
    const isDelete = false

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, commentId, owner, content, date, isDelete]
    }

    const result: QueryResult<AddReplyResultType> = await this._pool.query(query)

    return new AddedReply(result.rows[0])
  }

  async deleteReply (id: string): Promise<void> {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (result.rowCount === 0) {
      throw new NotFoundError('balasan tidak ditemukan')
    }
  }

  async verifyReplyOwner (id: string, owner: string): Promise<void> {
    const query = {
      text: 'SELECT owner FROM replies WHERE is_delete = \'false\' AND id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (result.rowCount === 0) {
      throw new NotFoundError('balasan tidak ditemukan')
    }

    const reply = result.rows[0]

    if (reply.owner !== owner) {
      throw new AuthorizationError('anda tidak memiliki akses')
    }
  }

  async getRepliesByThreadId (threadId: string): Promise<GetRepliesByThreadIdType[]> {
    const query = {
      text: `SELECT replies.id, replies.comment_id, replies.date, replies.content, replies.is_delete, users.username
        FROM replies LEFT JOIN users ON users.id = replies.owner
        LEFT JOIN comments ON comments.id = replies.comment_id
        WHERE comments.thread_id = $1 ORDER BY replies.date ASC`,
      values: [threadId]
    }

    const results: QueryResult<RepliesByIdType> = await this._pool.query(query)
    const comments = results.rows.map((result) => new Reply(result))

    return comments
  }
}

export default ReplyRepositoryPostgres
