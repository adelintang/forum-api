import LikeComment from '../../Domains/userCommentLikes/entities/LikeComment'

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

interface LikeCommentUseCaseType {
  commentRepository: CommentRepositoryType
  threadRepository: ThreadRepositoryType
  userRepository: UserRepositoryType
  userCommentLikeRepository: UserCommentLikeRepositoryType
}

interface UseCasePayloadType {
  threadId: string
  commentId: string
  owner: string
}

class LikeCommentUseCase {
  _commentRepository: CommentRepositoryType
  _threadRepository: ThreadRepositoryType
  _userRepository: UserRepositoryType
  _userCommentLikeRepository: UserCommentLikeRepositoryType

  constructor ({
    commentRepository, threadRepository, userRepository, userCommentLikeRepository
  }: LikeCommentUseCaseType) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._userRepository = userRepository
    this._userCommentLikeRepository = userCommentLikeRepository
  }

  async execute (useCasePayload: UseCasePayloadType): Promise<any> {
    const { threadId, commentId, owner } = new LikeComment(useCasePayload)

    await this._threadRepository.verifyThreadExists(threadId)
    await this._commentRepository.verifyCommentExists(commentId)
    await this._userRepository.verifyUserExist(owner)
    const likeExist = await this._userCommentLikeRepository.verifyLikeExists(commentId, owner)

    if (likeExist) {
      await this._userCommentLikeRepository.deleteLike(commentId, owner)
      return
    }

    await this._userCommentLikeRepository.addLike(commentId, owner)
  }
}

export default LikeCommentUseCase
