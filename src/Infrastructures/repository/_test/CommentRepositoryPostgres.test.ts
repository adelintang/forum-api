import CommentsTableTestHelper from '../../../tests/CommentsTableTestHelper'
import ThreadsTableTestHelper from '../../../tests/ThreadsTableTestHelper'
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper'
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError'
import NotFoundError from '../../../Commons/exceptions/NotFoundError'
import AddedComment from '../../../Domains/comments/entities/AddedComment'
import Comment from '../../../Domains/comments/entities/Comment'
import NewComment from '../../../Domains/comments/entities/NewComment'
import pool from '../../database/postgres/pool'
import CommentRepositoryPostgres from '../CommentRepositoryPostgres'

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Lorem ipsum sit dolor',
        owner: 'user-123'
      })

      const fakeIdGenerator = (): string => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await commentRepositoryPostgres.addComment(newComment)

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123')
      expect(comment).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })

      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Lorem ipsum sit dolor',
        owner: 'user-123'
      })

      const fakeIdGenerator = (): string => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner
      }))
    })
  })

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteComment('comment-123'))
        .rejects.toThrowError(NotFoundError)
      const comment = await CommentsTableTestHelper.findCommentById('comment-123')
      expect(comment[0]).toBeUndefined()
    })

    it('should delete comment using soft delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123')

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123')
      expect(comment).toHaveLength(1)
      expect(comment[0].is_delete).toBe('true')
    })
  })

  describe('verifyCommentOwner function', () => {
    it('should not throw error when comment owned by user owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'Lorem' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrow()
    })

    it('should throw NotFoundError when comment not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'Lorem' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-999', 'user-123'))
        .rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when not owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'Lorem' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-999'))
        .rejects.toThrowError(AuthorizationError)
    })
  })

  describe('getCommentsByThreadId function', () => {
    it('should return empty comments', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const commentRepository = await commentRepositoryPostgres.getCommentsByThreadId('thread-123')

      // Assert
      expect(commentRepository).toEqual([])
    })

    it('should return comments correctly', async () => {
      // Arrange
      const date = new Date().toISOString()
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'lorem', date })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const commentRepository = await commentRepositoryPostgres.getCommentsByThreadId('thread-123')

      // Assert
      expect(commentRepository.length).toBe(1)
      expect(commentRepository[0]).toEqual(new Comment({
        id: 'comment-123',
        content: 'lorem',
        date,
        username: 'dicoding',
        is_delete: 'false',
        count: '0'
      }))
    })
  })

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('xxx')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrowError(NotFoundError)
    })
  })
})
