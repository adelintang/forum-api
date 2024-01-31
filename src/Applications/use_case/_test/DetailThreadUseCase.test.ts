import Thread from '../../../Domains/threads/entities/Thread'
import DetailThread from '../../../Domains/threads/entities/DetailThread'
import Comment from '../../../Domains/comments/entities/Comment'
import Reply from '../../../Domains/replies/entities/Reply'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import DetailThreadUseCase from '../DetailThreadUseCase'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ReplyRepository from '../../../Domains/replies/ReplyRepository'

interface NewThreadType {
  title: string
  body: string
  owner: string
}

interface ThreadRepositoryType {
  addThread: (newThread: NewThreadType) => Promise<void>
  verifyThreadExists: (id: string) => Promise<any>
  getThreadById: (id: string) => Promise<any>
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
  getCommentsByThreadId: (threadId: string) => Promise<any>
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
  getRepliesByThreadId: (threadId: string) => Promise<any>
}

interface CommentsType {
  id: string
  date: string
  content: string
  is_delete: string
  username: string
  count: string
}

interface RepliesType {
  id: string
  comment_id: string
  date: string
  content: string
  is_delete: string
  username: string
}

describe('DetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    }

    const mockThread = new Thread({
      id: 'thread-123',
      title: 'New Thread',
      body: 'lorem ipsum sit dolor',
      date: new Date().toISOString(),
      username: 'dicoding'
    })

    const mockCommentOne: CommentsType | any = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: 'true',
      count: '0'
    })

    const mockCommentTwo: CommentsType | any = new Comment({
      id: 'comment-124',
      username: 'John',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolorm',
      is_delete: 'false',
      count: '1'
    })

    const mockReply: RepliesType | any = new Reply({
      id: 'reply-123',
      username: 'James',
      date: new Date().toISOString(),
      content: 'lorem ipsum sit dolor',
      is_delete: 'false',
      comment_id: 'comment-123'
    })

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()
    const mockReplyRepository: ReplyRepositoryType = new ReplyRepository()

    mockThreadRepository.getThreadById = jest.fn(async () => await Promise.resolve(mockThread))
    mockCommentRepository.getCommentsByThreadId = jest.fn(async () => await Promise.resolve([
      mockCommentOne, mockCommentTwo
    ]))
    mockReplyRepository.getRepliesByThreadId = jest.fn(async () => await Promise.resolve([mockReply]))

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123')
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123')
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith('thread-123')
    expect(detailThread).toEqual(new DetailThread({
      thread: mockThread,
      comments: [
        mockCommentOne,
        mockCommentTwo
      ],
      replies: [mockReply]
    }))
  })
})
