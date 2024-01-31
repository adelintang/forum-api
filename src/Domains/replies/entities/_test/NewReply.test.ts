import NewReply from '../NewReply'

describe('NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'Lorem ipsum sit dolor'
    }

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: ['Lorem ipsum sit dolor'],
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewReply entities correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action
    const newReply = new NewReply(payload)

    // Assert
    expect(newReply).toBeInstanceOf(NewReply)
    expect(newReply.commentId).toBe(payload.commentId)
    expect(newReply.content).toBe(payload.content)
    expect(newReply.owner).toBe(payload.owner)
  })
})
