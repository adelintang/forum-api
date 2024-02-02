import { type Pool } from 'pg'
import InvariantError from '../../Commons/exceptions/InvariantError'
import UserCommentLikeRepository from '../../Domains/userCommentLikes/UserCommentLikeRepository'

class UserCommentLikeRepositoryPostgres extends UserCommentLikeRepository {
  _pool: Pool
  _idGenerator: any
  constructor (pool: Pool, idGenerator: any) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addLike (commentId: string, owner: string): Promise<void> {
    const id = `like-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, owner]
    }

    await this._pool.query(query)
  }

  async verifyLikeExists (commentId: string, owner: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const result = await this._pool.query(query)

    return Boolean(result.rowCount)
  }

  async deleteLike (commentId: string, owner: string): Promise<void> {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const result = await this._pool.query(query)

    if (result.rowCount === 0) {
      throw new InvariantError('komentar yang disukai tidak ditemukan')
    }
  }
}

export default UserCommentLikeRepositoryPostgres
