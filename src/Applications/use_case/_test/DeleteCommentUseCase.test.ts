import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import DeleteCommentUseCase from '../DeleteCommentUseCase'

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

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()

    mockCommentRepository.verifyCommentOwner = jest.fn(async () => await Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn(async () => await Promise.resolve())
    mockThreadRepository.verifyThreadExists = jest.fn(async () => await Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    await deleteCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith('comment-123', 'user-123')
    expect(mockCommentRepository.deleteComment).toBeCalledWith('comment-123')
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123')
  })
})
