import CommentsTableTestHelper from '../../../tests/CommentsTableTestHelper'
import RepliesTableTestHelper from '../../../tests/RepliesTableTestHelper'
import ThreadsTableTestHelper from '../../../tests/ThreadsTableTestHelper'
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper'
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError'
import NotFoundError from '../../../Commons/exceptions/NotFoundError'
import AddedReply from '../../../Domains/replies/entities/AddedReply'
import NewReply from '../../../Domains/replies/entities/NewReply'
import Reply from '../../../Domains/replies/entities/Reply'
import pool from '../../database/postgres/pool'
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres'

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReply function', () => {
    it('should persist new reply and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      const newReply = new NewReply({
        commentId: 'comment-123',
        content: 'Lorem ipsum sit dolor',
        owner: 'user-123'
      })

      const fakeIdGenerator = (): string => '123' // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await replyRepositoryPostgres.addReply(newReply)

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123')
      expect(reply).toHaveLength(1)
    })

    it('should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      const newReply = new NewReply({
        commentId: 'comment-123',
        content: 'Lorem ipsum sit dolor',
        owner: 'user-123'
      })

      const fakeIdGenerator = (): string => '123' // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply)

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: newReply.content,
        owner: newReply.owner
      }))
    })
  })

  describe('deleteReply function', () => {
    it('should throw NotFoundError when reply not exists', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(replyRepositoryPostgres.deleteReply('reply-123'))
        .rejects.toThrowError(NotFoundError)
      const reply = await RepliesTableTestHelper.findReplyById('reply-123')
      expect(reply[0]).toBeUndefined()
    })

    it('should delete reply using soft delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      await RepliesTableTestHelper.addReply({ content: 'dolor' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123')

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123')
      expect(reply).toHaveLength(1)
      expect(reply[0].is_delete).toBe('true')
    })
  })

  describe('verifyReplyOwner function', () => {
    it('should not throw error when reply owned by user owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      await RepliesTableTestHelper.addReply({ content: 'dolor' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves.not.toThrow()
    })

    it('should throw NotFoundError when reply not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-999', 'user-123'))
        .rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when not owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      await RepliesTableTestHelper.addReply({ content: 'dolor' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-999'))
        .rejects.toThrowError(AuthorizationError)
    })
  })

  describe('getRepliesByThreadId function', () => {
    it('should return empty replies', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      const replyRepository = await replyRepositoryPostgres.getRepliesByThreadId('thread-123')

      // Assert
      expect(replyRepository.length).toEqual(0)
      expect(replyRepository).toEqual([])
    })

    it('should return replies correctly', async () => {
      // Arrange
      const date = new Date().toISOString()
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem ipsum' })
      await RepliesTableTestHelper.addReply({ content: 'dolor', date })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      const replyRepository = await replyRepositoryPostgres.getRepliesByThreadId('thread-123')

      // Assert
      expect(replyRepository.length).toBe(1)
      expect(replyRepository[0]).toEqual(new Reply({
        id: 'reply-123',
        content: 'dolor',
        date,
        username: 'dicoding',
        is_delete: 'false',
        comment_id: 'comment-123'
      }))
    })
  })
})
