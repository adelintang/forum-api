import CommentsTableTestHelper from '../../../tests/CommentsTableTestHelper'
import ThreadsTableTestHelper from '../../../tests/ThreadsTableTestHelper'
import UserCommentLikesTableTestHelper from '../../../tests/UserCommentLikesTableTestHelper'
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper'
import InvariantError from '../../../Commons/exceptions/InvariantError'
import pool from '../../database/postgres/pool'
import UserCommentLikeRepositoryPostgres from '../UserCommentLikeRepositoryPostgres'

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await UserCommentLikesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addLike function', () => {
    it('should persist add comment like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })
      const fakeIdGenerator = (): string => '123' // stub
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await userCommentLikeRepositoryPostgres.addLike('comment-123', 'user-123')

      // Assert
      const like = await UserCommentLikesTableTestHelper.findLikeById('like-123')
      expect(like).toHaveLength(1)
    })

    it('should get like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })
      const fakeIdGenerator = (): string => '123' // stub
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await userCommentLikeRepositoryPostgres.addLike('comment-123', 'user-123')

      // Assert
      const like = await UserCommentLikesTableTestHelper.findLikeById('like-123')
      expect(like[0].id).toBe('like-123')
      expect(like[0].owner).toBe('user-123')
    })
  })

  describe('verifyLikeExists function', () => {
    it('should return false when like not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })
      await UserCommentLikesTableTestHelper.addLike({ id: 'like-123' })
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(userCommentLikeRepositoryPostgres.verifyLikeExists('comment-321', 'user-321')).resolves.toBe(false)
    })

    it('should return true when user exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })
      await UserCommentLikesTableTestHelper.addLike({ id: 'like-123' })
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(userCommentLikeRepositoryPostgres.verifyLikeExists('comment-123', 'user-123'))
        .resolves.toBe(true)
    })
  })

  describe('deleteLike', () => {
    it('should throw InvariantError when like not found', async () => {
      // Arrange
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(userCommentLikeRepositoryPostgres.deleteLike('comment-321', 'user-321'))
        .rejects.toThrowError(InvariantError)
    })

    it('should not throw InvariantError when like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })
      await UserCommentLikesTableTestHelper.addLike({ id: 'like-123' })
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {})

      // Action and Assert
      return await expect(userCommentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123'))
        .resolves.not.toThrowError(InvariantError)
    })

    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' })
      await CommentsTableTestHelper.addComment({ content: 'ipsum' })
      await UserCommentLikesTableTestHelper.addLike({ id: 'like-123' })
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {})

      // Action
      await userCommentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123')

      // Assert
      const like = await UserCommentLikesTableTestHelper.findLikeById('like-123')
      expect(like).toHaveLength(0)
    })
  })
})
