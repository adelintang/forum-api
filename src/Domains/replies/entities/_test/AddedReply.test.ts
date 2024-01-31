import AddedReply from '../AddedReply'

describe('AddedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: ['Lorem ipsum sit dolor'],
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action
    const addedReply = new AddedReply(payload)

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply)
    expect(addedReply.id).toBe(payload.id)
    expect(addedReply.content).toBe(payload.content)
    expect(addedReply.owner).toBe(payload.owner)
  })
})
