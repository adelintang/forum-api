/* istanbul ignore file */
import { Pool } from 'pg'

interface TestConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

const testConfig: TestConfig = {
  host: process.env.PGHOST_TEST as unknown as string,
  port: process.env.PGPORT_TEST as unknown as number,
  user: process.env.PGUSER_TEST as unknown as string,
  password: process.env.PGPASSWORD_TEST as unknown as string,
  database: process.env.PGDATABASE_TEST as unknown as string
}

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool()

export default pool
