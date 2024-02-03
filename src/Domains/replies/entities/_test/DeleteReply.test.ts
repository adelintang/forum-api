import DeleteReply from '../DeleteReply'

interface PayloadType {
  threadId: any
  commentId: string
  replyId: string
  owner: string
}

describe('DeleteReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload: PayloadType = {
      threadId: undefined,
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload: PayloadType = {
      threadId: 123,
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }
    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DeleteReply entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }

    // Action
    const deleteReply = new DeleteReply(payload)

    // Assert
    expect(deleteReply).toBeInstanceOf(DeleteReply)
    expect(deleteReply.threadId).toBe(payload.threadId)
    expect(deleteReply.commentId).toBe(payload.commentId)
    expect(deleteReply.replyId).toBe(payload.replyId)
    expect(deleteReply.owner).toBe(payload.owner)
  })
})
