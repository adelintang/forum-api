import DeleteReply from '../../Domains/replies/entities/DeleteReply'

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

interface DeleteReplyUseCaseType {
  commentRepository: CommentRepositoryType
  threadRepository: ThreadRepositoryType
  replyRepository: ReplyRepositoryType
}

interface UseCasePayloadType {
  threadId: string
  commentId: string
  replyId: string
  owner: string
}

class DeleteReplyUseCase {
  _commentRepository: CommentRepositoryType
  _threadRepository: ThreadRepositoryType
  _replyRepository: ReplyRepositoryType

  constructor ({ commentRepository, threadRepository, replyRepository }: DeleteReplyUseCaseType) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload: UseCasePayloadType): Promise<void> {
    const {
      threadId, commentId, replyId, owner
    } = new DeleteReply(useCasePayload)

    await this._threadRepository.verifyThreadExists(threadId)
    await this._commentRepository.verifyCommentExists(commentId)
    await this._replyRepository.verifyReplyOwner(replyId, owner)
    await this._replyRepository.deleteReply(replyId)
  }
}

export default DeleteReplyUseCase
