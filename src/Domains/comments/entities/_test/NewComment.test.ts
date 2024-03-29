import NewComment from '../NewComment'

interface PayloadType {
  threadId: any
  content: string
  owner: string
}

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload: PayloadType = {
      threadId: undefined,
      content: 'Lorem ipsum sit dolor',
      owner: 'dicoding'
    }

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload: PayloadType = {
      threadId: 123,
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action
    const newComment = new NewComment(payload)

    // Assert
    expect(newComment).toBeInstanceOf(NewComment)
    expect(newComment.threadId).toBe(payload.threadId)
    expect(newComment.content).toBe(payload.content)
    expect(newComment.owner).toBe(payload.owner)
  })
})
