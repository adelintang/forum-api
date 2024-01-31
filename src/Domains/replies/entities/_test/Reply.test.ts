import Reply from '../Reply'

describe('Reply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      comment_id: 'comment-123'
    }

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: ['dicoding'],
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: 'false',
      comment_id: 'comment-123'
    }

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Reply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'repy-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: 'false',
      comment_id: 'comment-123'
    }

    // Action
    const reply = new Reply(payload)

    // Assert
    expect(reply).toBeInstanceOf(Reply)
    expect(reply.id).toBe(payload.id)
    expect(reply.username).toBe(payload.username)
    expect(reply.date).toBe(payload.date)
    expect(reply.content).toBe(payload.content)
    expect(reply.commentId).toBe(payload.comment_id)
  })

  it('should create Reply entities correctly when is delete', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: 'true',
      comment_id: 'comment-123'
    }

    // Action
    const reply = new Reply(payload)

    // Assert
    expect(reply).toBeInstanceOf(Reply)
    expect(reply.id).toBe(payload.id)
    expect(reply.username).toBe(payload.username)
    expect(reply.date).toBe(payload.date)
    expect(reply.content).toBe('**balasan telah dihapus**')
    expect(reply.commentId).toBe(payload.comment_id)
  })
})
