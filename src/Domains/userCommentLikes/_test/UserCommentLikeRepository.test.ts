import UserCommentLikesRepository from '../UserCommentLikeRepository'

describe('UserCommentLikesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userCommentLikeRepository = new UserCommentLikesRepository()

    // Action and Assert
    await expect(userCommentLikeRepository.addLike('', '')).rejects.toThrowError('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userCommentLikeRepository.verifyLikeExists('', '')).rejects.toThrowError('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userCommentLikeRepository.deleteLike('', '')).rejects.toThrowError('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
