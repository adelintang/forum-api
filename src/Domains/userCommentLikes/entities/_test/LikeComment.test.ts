import LikeComment from '../LikeComment'

describe('LikeComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    // Action and Assert
    expect(() => new LikeComment(payload)).toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: ['user-123']
    }

    // Action and Assert
    expect(() => new LikeComment(payload)).toThrowError('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create likeComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    // Action
    const likeComment = new LikeComment(payload)

    // Assert
    expect(likeComment.threadId).toEqual(payload.threadId)
    expect(likeComment.commentId).toEqual(payload.commentId)
    expect(likeComment.owner).toEqual(payload.owner)
  })
})
