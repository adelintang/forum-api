class UserCommentLikeRepository {
  async addLike (commentId: string, owner: string): Promise<void> {
    throw new Error('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyLikeExists (commentId: string, owner: string): Promise<void> {
    throw new Error('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteLike (commentId: string, owner: string): Promise<void> {
    throw new Error('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

export default UserCommentLikeRepository
