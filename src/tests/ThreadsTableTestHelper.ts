/* istanbul ignore file */
import pool from '../Infrastructures/database/postgres/pool'

interface AddThreadType {
  id?: string
  owner?: string
  title?: string
  body?: string
  date?: string | any
}

const ThreadsTableTestHelper = {
  async addThread ({
    id = 'thread-123', owner = 'user-123', title = 'Lorem', body = 'Lorem ipsum sit dolor', date = new Date().toISOString
  }: AddThreadType) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, title, body, date]
    }

    await pool.query(query)
  },

  async findThreadById (id: string) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

export default ThreadsTableTestHelper
