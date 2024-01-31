import NewThread from '../NewThread'

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'New Thread'
    }

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'New Thread',
      body: ['Lorem ipsum sit dolor'],
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'New Thread',
      body: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    // Action
    const newThread = new NewThread(payload)

    // Assert
    expect(newThread).toBeInstanceOf(NewThread)
    expect(newThread.title).toBe(payload.title)
    expect(newThread.body).toBe(payload.body)
    expect(newThread.owner).toBe(payload.owner)
  })
})
