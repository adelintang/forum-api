/* istanbul ignore file */
import pool from '../Infrastructures/database/postgres/pool'

interface AddReplyType {
  id?: string
  commentId?: string
  owner?: string
  content?: string
  date?: string | any
  isDelete?: string
}

const RepliesTableTestHelper = {
  async addReply ({
    id = 'reply-123', owner = 'user-123', commentId = 'comment-123', content = 'Lorem ipsum sit dolor', date = new Date().toISOString, isDelete = 'false'
  }: AddReplyType) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, owner, content, date, isDelete]
    }

    await pool.query(query)
  },

  async addDeleteReply ({
    id = 'reply-123', owner = 'user-123', commentId = 'comment-123', content = 'Lorem ipsum sit dolor', date = new Date().toISOString
  }) {
    await this.addReply({
      id, commentId, owner, content, date, isDelete: 'true'
    })
  },

  async findReplyById (id: string) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  }
}

export default RepliesTableTestHelper
