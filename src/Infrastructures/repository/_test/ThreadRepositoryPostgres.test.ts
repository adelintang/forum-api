import ThreadsTableTestHelper from '../../../tests/ThreadsTableTestHelper'
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper'
import NotFoundError from '../../../Commons/exceptions/NotFoundError'
import AddedThread from '../../../Domains/threads/entities/AddedThread'
import NewThread from '../../../Domains/threads/entities/NewThread'
import Thread from '../../../Domains/threads/entities/Thread'
import pool from '../../database/postgres/pool'
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres'

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const newThread = new NewThread({
        title: 'Lorem',
        body: 'Lorem ipsum sit dolor',
        owner: 'user-123'
      })

      const fakeIdGenerator = (): string => '123' // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(newThread)

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123')
      expect(thread).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const newThread = new NewThread({
        title: 'Lorem',
        body: 'Lorem ipsum sit dolor',
        owner: 'user-123'
      })

      const fakeIdGenerator = (): string => '123' // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: newThread.owner
      }))
    })
  })

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('xxx')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(threadRepositoryPostgres.getThreadById('xxx')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread exists', async () => {
      // Arrange
      const date = new Date().toISOString()
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem', date })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      const thread = await threadRepositoryPostgres.getThreadById('thread-123')
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).resolves.not.toThrowError(NotFoundError)
      expect(thread).toEqual(new Thread({
        id: 'thread-123',
        title: 'Lorem',
        body: 'Lorem ipsum sit dolor',
        date,
        username: 'dicoding'
      }))
    })
  })
})
