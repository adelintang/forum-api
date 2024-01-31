import CommentRepository from '../../../Domains/comments/CommentRepository'
import ReplyRepository from '../../../Domains/replies/ReplyRepository'
import AddedReply from '../../../Domains/replies/entities/AddedReply'
import NewReply from '../../../Domains/replies/entities/NewReply'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import AddReplyUseCase from '../AddReplyUseCase'

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

describe('AddCommentUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'John Doe'
    })

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()
    const mockReplyRepository: ReplyRepositoryType = new ReplyRepository()

    mockCommentRepository.verifyCommentExists = jest.fn(async () => await Promise.resolve())
    mockThreadRepository.verifyThreadExists = jest.fn(async () => await Promise.resolve())
    mockReplyRepository.addReply = jest.fn(async () => await Promise.resolve(mockAddedReply))

    const addedReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const addedReply = await addedReplyUseCase.execute(useCasePayload)

    // Assert
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      commentId: 'comment-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }))
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123')
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123')
    expect(addedReply).toEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'John Doe'
    }))
  })
})
