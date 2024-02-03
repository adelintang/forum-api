/* istanbul ignore file */
import pool from '../Infrastructures/database/postgres/pool'

interface AddCommentType {
  id?: string
  threadId?: string
  owner?: string
  content?: string
  date?: string | any
  isDelete?: string
}

const CommentsTableTestHelper = {
  async addComment ({
    id = 'comment-123', owner = 'user-123', threadId = 'thread-123', content = 'Lorem ipsum sit dolor', date = new Date().toISOString, isDelete = 'false'
  }: AddCommentType) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, owner, content, date, isDelete]
    }

    await pool.query(query)
  },

  async addDeleteComment ({
    id = 'comment-123', owner = 'user-123', threadId = 'thread-123', content = 'Lorem ipsum sit dolor', date = new Date().toISOString
  }) {
    await this.addComment({
      id, owner, threadId, content, date, isDelete: 'true'
    })
  },

  async findCommentById (id: string) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

export default CommentsTableTestHelper
