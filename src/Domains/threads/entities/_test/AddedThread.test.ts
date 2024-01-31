import AddedThread from '../AddedThread'

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'New Thread',
      owner: 'John Doe'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      owner: ['John Doe']
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      owner: 'John Doe'
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread)
    expect(addedThread.id).toBe(payload.id)
    expect(addedThread.title).toBe(payload.title)
    expect(addedThread.owner).toBe(payload.owner)
  })
})
