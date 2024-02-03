import Comment from '../Comment'

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    interface PayloadType {
      id: string
      username: string
      date: string
      content: string
      is_delete: any
      count: any
    }

    const payload: PayloadType = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: undefined,
      count: undefined
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    interface PayloadType {
      id: any
      username: string
      date: string
      content: string
      is_delete: string
      count: string
    }

    const payload: PayloadType = {
      id: 123,
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: 'false',
      count: '0'
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: 'false',
      count: '0'
    }

    // Action
    const comment = new Comment(payload)

    // Assert
    expect(comment).toBeInstanceOf(Comment)
    expect(comment.id).toBe(payload.id)
    expect(comment.username).toBe(payload.username)
    expect(comment.date).toBe(payload.date)
    expect(comment.likeCount).toBe(0)
    expect(comment.content).toBe(payload.content)
  })
})
