import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import UserCommentLikesRepository from '../../../Domains/userCommentLikes/UserCommentLikeRepository'
import UserRepository from '../../../Domains/users/UserRepository'
import LikeCommentUseCase from '../LikeCommentUseCase'

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
  verifyCommentExists: (id: string) => Promise<any>
}

interface RegisterUserType {
  username: string
  password: string
  fullname: string
}

interface UserRepositoryType {
  addUser: (registerUser: RegisterUserType) => Promise<void>
  verifyAvailableUsername: (username: string) => Promise<void>
  verifyUserExist: (id: string) => Promise<void>
  getPasswordByUsername: (username: string) => Promise<void>
  getIdByUsername: (username: string) => Promise<void>
}

interface UserCommentLikeRepositoryType {
  addLike: (commentId: string, owner: string) => Promise<void>
  verifyLikeExists: (commentId: string, owner: string) => Promise<any>
  deleteLike: (commentId: string, owner: string) => Promise<void>
}

describe('LikeCommentUseCase', () => {
  it('should orchestrating the add like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()
    const mockUserCommentLikesRepository: UserCommentLikeRepositoryType = new UserCommentLikesRepository()
    const mockUserRepository: UserRepositoryType = new UserRepository()

    mockThreadRepository.verifyThreadExists = jest.fn(async () => await Promise.resolve())
    mockCommentRepository.verifyCommentExists = jest.fn(async () => await Promise.resolve())
    mockUserCommentLikesRepository.verifyLikeExists = jest.fn(async () => await Promise.resolve(false))
    mockUserCommentLikesRepository.addLike = jest.fn(async () => await Promise.resolve())
    mockUserCommentLikesRepository.deleteLike = jest.fn(async () => await Promise.resolve())
    mockUserRepository.verifyUserExist = jest.fn(async () => await Promise.resolve())

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      userCommentLikeRepository: mockUserCommentLikesRepository
    })

    // Action
    await likeCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123')
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123')
    expect(mockUserRepository.verifyUserExist).toBeCalledWith('user-123')
    expect(mockUserCommentLikesRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123')
    expect(mockUserCommentLikesRepository.addLike).toBeCalledWith('comment-123', 'user-123')
    expect(mockUserCommentLikesRepository.deleteLike).toBeCalledTimes(0)
  })

  it('should orchestrating the delete like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }
    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    const mockCommentRepository: CommentRepositoryType = new CommentRepository()
    const mockUserCommentLikesRepository: UserCommentLikeRepositoryType = new UserCommentLikesRepository()
    const mockUserRepository: UserRepositoryType = new UserRepository()

    mockThreadRepository.verifyThreadExists = jest.fn(async () => await Promise.resolve())
    mockCommentRepository.verifyCommentExists = jest.fn(async () => await Promise.resolve())
    mockUserCommentLikesRepository.verifyLikeExists = jest.fn(async () => await Promise.resolve(true))
    mockUserCommentLikesRepository.deleteLike = jest.fn(async () => await Promise.resolve())
    mockUserCommentLikesRepository.addLike = jest.fn(async () => await Promise.resolve())
    mockUserRepository.verifyUserExist = jest.fn(async () => await Promise.resolve())

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      userCommentLikeRepository: mockUserCommentLikesRepository
    })

    // Action
    await likeCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123')
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123')
    expect(mockUserRepository.verifyUserExist).toBeCalledWith('user-123')
    expect(mockUserCommentLikesRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123')
    expect(mockUserCommentLikesRepository.deleteLike).toBeCalledWith('comment-123', 'user-123')
    expect(mockUserCommentLikesRepository.addLike).toBeCalledTimes(0)
  })
})
