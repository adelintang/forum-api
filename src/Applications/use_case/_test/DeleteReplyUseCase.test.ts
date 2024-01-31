import CommentRepository from '../../../Domains/comments/CommentRepository'
import ReplyRepository from '../../../Domains/replies/ReplyRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import DeleteReplyUseCase from '../DeleteReplyUseCase'

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
  verifyCommentExists: (id: string) => Promise<void>
}

interface NewReplyType {
  commentId: string
  content: string
  owner: string
}

interface ReplyRepositoryType {
  addReply: (newReply: NewReplyType) => Promise<any>
  deleteReply: (id: string) => Promise<void>
  verifyReplyOwner: (id: string, owner: string) => Promise<void>
  getRepliesByThreadId: (threadId: string) => Promise<void>
}

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()
    const mockReplyRepository: ReplyRepositoryType = new ReplyRepository()

    mockReplyRepository.verifyReplyOwner = jest.fn(async () => await Promise.resolve())
    mockReplyRepository.deleteReply = jest.fn(async () => await Promise.resolve())
    mockCommentRepository.verifyCommentExists = jest.fn(async () => await Promise.resolve())
    mockThreadRepository.verifyThreadExists = jest.fn(async () => await Promise.resolve())

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    await deleteReplyUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123')
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123')
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith('reply-123', 'user-123')
    expect(mockReplyRepository.deleteReply).toBeCalledWith('reply-123')
  })
})
