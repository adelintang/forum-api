import DeleteComment from '../../Domains/comments/entities/DeleteComment'

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

interface DeleteCommentUseCaseType {
  commentRepository: CommentRepositoryType
  threadRepository: ThreadRepositoryType
}

interface DeleteCommentType {
  threadId: string
  commentId: string
  owner: string
}

class DeleteCommentUseCase {
  _commentRepository: CommentRepositoryType
  _threadRepository: ThreadRepositoryType

  constructor ({ commentRepository, threadRepository }: DeleteCommentUseCaseType) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload: DeleteCommentType): Promise<void> {
    const { threadId, commentId, owner } = new DeleteComment(useCasePayload)

    await this._threadRepository.verifyThreadExists(threadId)
    await this._commentRepository.verifyCommentOwner(commentId, owner)
    await this._commentRepository.deleteComment(commentId)
  }
}

export default DeleteCommentUseCase
