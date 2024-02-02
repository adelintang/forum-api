/* istanbul ignore file */
import pool from '../Infrastructures/database/postgres/pool'

const UserCommentLikesTableTestHelper = {
  async addLike ({
    id = 'like-123', owner = 'user-123', commentId = 'comment-123'
  }) {
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, owner]
    }

    await pool.query(query)
  },

  async findLikeById (id: string) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async findLikeByCommentIdAndOwner (owner: string, commentId: string) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM user_comment_likes WHERE 1=1')
  }
}

export default UserCommentLikesTableTestHelper
