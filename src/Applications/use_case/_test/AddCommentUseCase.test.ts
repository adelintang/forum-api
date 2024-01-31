import NotFoundError from '../../../Commons/exceptions/NotFoundError'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import AddedComment from '../../../Domains/comments/entities/AddedComment'
import NewComment from '../../../Domains/comments/entities/NewComment'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import AddCommentUseCase from '../AddCommentUseCase'

interface NewThreadType {
  title: string
  body: string
  owner: string
}

interface ThreadRepositoryType {
  addThread: (newThread: NewThreadType) => Promise<void>
  verifyThreadExists: (id: string) => Promise<any>
  getThreadById: (id: string) => Promise<void>
}

interface NewCommentType {
  threadId: string
  content: string
  owner: string
}

interface CommentRepositoryType {
  addComment: (newComment: NewCommentType) => Promise<any>
  deleteComment: (id: string) => Promise<void>
  verifyCommentOwner: (id: string, owner: string) => Promise<void>
  getCommentsByThreadId: (threadId: string) => Promise<void>
}

describe('AddCommentUseCase', () => {
  it('should throw error when thread not exists', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-xxx',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'John Doe'
    })

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()

    mockThreadRepository.verifyThreadExists = jest.fn(async () => await Promise.reject(new NotFoundError('')))
    mockCommentRepository.addComment = jest.fn(async () => await Promise.resolve(mockAddedComment))

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action and Assert
    await expect(async () => await addCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError(NotFoundError)
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-xxx')
    expect(mockCommentRepository.addComment).not.toBeCalled()
  })

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'John Doe'
    })

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()

    mockCommentRepository.addComment = jest.fn(async () => await Promise.resolve(mockAddedComment))
    mockThreadRepository.verifyThreadExists = jest.fn(async () => await Promise.resolve())

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      threadId: 'thread-123',
      content: useCasePayload.content,
      owner: 'user-123'
    }))
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123')
    expect(addedComment).toEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'John Doe'
    }))
  })
})
