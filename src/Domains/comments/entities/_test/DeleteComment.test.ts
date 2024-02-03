import DeleteComment from '../DeleteComment'

describe('DeleteComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    interface PayloadType {
      threadId: string
      commentId: string
      owner: any
    }

    const payload: PayloadType = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: undefined
    }

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    interface PayloadType {
      threadId: any
      commentId: string
      owner: string
    }

    const payload: PayloadType = {
      threadId: ['thread-123'],
      commentId: 'comment-123',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DeleteComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    // Action
    const deleteComment = new DeleteComment(payload)

    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteComment)
    expect(deleteComment.threadId).toBe(payload.threadId)
    expect(deleteComment.commentId).toBe(payload.commentId)
    expect(deleteComment.owner).toBe(payload.owner)
  })
})
