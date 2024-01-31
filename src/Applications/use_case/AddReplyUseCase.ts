import NewReply from '../../Domains/replies/entities/NewReply'

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

interface AddReplyUseCaseType {
  commentRepository: CommentRepositoryType
  threadRepository: ThreadRepositoryType
  replyRepository: ReplyRepositoryType
}

interface UseCasePayload {
  threadId: string
  commentId: string
  content: string
  owner: string
}

class AddReplyUseCase {
  _commentRepository: CommentRepositoryType
  _threadRepository: ThreadRepositoryType
  _replyRepository: ReplyRepositoryType

  constructor ({ commentRepository, threadRepository, replyRepository }: AddReplyUseCaseType) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload: UseCasePayload): Promise<NewReplyType> {
    const { threadId, commentId } = useCasePayload

    await this._threadRepository.verifyThreadExists(threadId)
    await this._commentRepository.verifyCommentExists(commentId)

    const newReply = new NewReply(useCasePayload)
    return await this._replyRepository.addReply(newReply)
  }
}

// commentId: string
// content: string
// owner: string

export default AddReplyUseCase
