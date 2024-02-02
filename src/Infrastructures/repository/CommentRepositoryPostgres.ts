import { type Pool } from 'pg'
import AuthorizationError from '../../Commons/exceptions/AuthorizationError'
import NotFoundError from '../../Commons/exceptions/NotFoundError'
import CommentRepository from '../../Domains/comments/CommentRepository'
import AddedComment from '../../Domains/comments/entities/AddedComment'
import Comment from '../../Domains/comments/entities/Comment'

interface AddCommentParamsType {
  threadId: string
  owner: string
  content: string
}

interface AddCommentType {
  id: string
  content: string
  owner: string
}

interface CommentsResultType {
  id: string
  date: string
  content: string
  is_delete: string
  username: string
  count: string
}

interface CommentsType {
  id: string
  username: string
  date: string
  content: string
  likeCount: number
}

interface QueryResult<T> {
  rows: T[]
}

class CommentRepositoryPostgres extends CommentRepository {
  _pool: Pool
  _idGenerator: any
  constructor (pool: Pool, idGenerator: any) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment ({ threadId, owner, content }: AddCommentParamsType): Promise<AddCommentType> {
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()
    const isDelete = false

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, owner, content, date, isDelete]
    }

    const result: QueryResult<AddCommentType> = await this._pool.query(query)
    const rows: AddCommentType = result.rows[0]

    return new AddedComment(rows)
  }

  async deleteComment (id: string): Promise<void> {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (result.rowCount === 0) {
      throw new NotFoundError('komen tidak ditemukan')
    }
  }

  async verifyCommentOwner (id: string, owner: string): Promise<void> {
    const query = {
      text: 'SELECT owner FROM comments WHERE is_delete = \'false\' AND id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (result.rowCount === 0) {
      throw new NotFoundError('komen tidak ditemukan')
    }

    const comment = result.rows[0]

    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak memiliki akses')
    }
  }

  async getCommentsByThreadId (threadId: string): Promise<CommentsType[]> {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, comments.is_delete, users.username, count(DISTINCT user_comment_likes.id) 
        FROM comments LEFT JOIN users ON comments.owner = users.id
        LEFT JOIN user_comment_likes ON comments.id = user_comment_likes.comment_id
        WHERE comments.thread_id = $1 GROUP BY comments.id, users.username ORDER BY comments.date ASC`,
      values: [threadId]
    }

    const results: QueryResult<CommentsResultType> = await this._pool.query(query)
    const comments: CommentsType[] = results.rows.map((result) => new Comment({ ...result }))

    return comments
  }

  async verifyCommentExists (id: string): Promise<void> {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('komen tidak ditemukan')
    }
  }
}

export default CommentRepositoryPostgres
