import Thread from '../Thread'

describe('Thread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      body: 'Lorem ipsum sit dolor',
      date: new Date().toISOString()
    }

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      body: ['Lorem ipsum sit dolor'],
      date: new Date().toISOString(),
      username: 'dicoding'
    }

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      body: 'Lorem ipsum sit dolor',
      date: new Date().toISOString(),
      username: 'dicoding'
    }

    // Action
    const thread = new Thread(payload)

    // Assert
    expect(thread).toBeInstanceOf(Thread)
    expect(thread.id).toBe(payload.id)
    expect(thread.title).toBe(payload.title)
    expect(thread.body).toBe(payload.body)
    expect(thread.date).toBe(payload.date)
    expect(thread.username).toBe(payload.username)
  })
})
