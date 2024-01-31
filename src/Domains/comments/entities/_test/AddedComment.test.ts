import AddedComment from '../AddedComment'

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: ['Lorem ipsum sit dolor'],
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action
    const addedThread = new AddedComment(payload)

    // Assert
    expect(addedThread).toBeInstanceOf(AddedComment)
    expect(addedThread.id).toBe(payload.id)
    expect(addedThread.content).toBe(payload.content)
    expect(addedThread.owner).toBe(payload.owner)
  })
})
