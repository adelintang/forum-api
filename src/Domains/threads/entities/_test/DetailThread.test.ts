import Comment from '../../../comments/entities/Comment'
import Reply from '../../../replies/entities/Reply'
import DetailThread from '../DetailThread'

describe('DetailThread entities', () => {
  it('should should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: {
        id: 'thread-123',
        title: 'New Thread',
        body: 'lorem ipsum sit dolor',
        date: new Date().toISOString(),
        username: 'dicoding'
      }
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: {
        id: 'thread-123',
        title: 'New Thread',
        body: 'lorem ipsum sit dolor',
        date: new Date().toISOString(),
        username: 'dicoding'
      },
      comments: 'this is comment',
      replies: []
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DetailThread entities correctly', () => {
    // Arrange
    const date = new Date().toISOString()
    const comment = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date,
      content: 'ipsum',
      is_delete: 'false',
      count: '1'
    })

    const reply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date,
      content: 'dolor',
      is_delete: 'false',
      comment_id: 'comment-123'
    })

    const payload = {
      thread: {
        id: 'thread-123',
        title: 'Lorem',
        body: 'lorem ipsum sit dolor',
        date,
        username: 'dicoding'
      },
      comments: [comment],
      replies: [reply]
    }

    // Action
    const detailThread = new DetailThread(payload)

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread)
    expect(detailThread.thread.id).toBe(payload.thread.id)
    expect(detailThread.thread.title).toBe(payload.thread.title)
    expect(detailThread.thread.body).toBe(payload.thread.body)
    expect(detailThread.thread.date).toBe(payload.thread.date)
    expect(detailThread.thread.username).toBe(payload.thread.username)
    expect(detailThread.thread.comments).toEqual([
      {
        id: 'comment-123',
        username: 'dicoding',
        date,
        content: 'ipsum',
        replies: [
          {
            id: 'reply-123',
            username: 'dicoding',
            date,
            content: 'dolor'
          }
        ],
        likeCount: 1
      }
    ])
    expect(detailThread.thread.comments[0].replies).toEqual([
      {
        id: 'reply-123',
        username: 'dicoding',
        date,
        content: 'dolor'
      }
    ])
  })
})
