import CommentRepository from '../CommentRepository'

describe('CommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const commentRepository = new CommentRepository()

    // Action and Assert
    await expect(commentRepository.addComment({
      threadId: '',
      content: '',
      owner: ''
    })).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.deleteComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.verifyCommentOwner('', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.verifyCommentExists('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
