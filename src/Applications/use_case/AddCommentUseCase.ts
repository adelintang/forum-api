import NewComment from '../../Domains/comments/entities/NewComment'

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

interface AddCommentUseCaseType {
  commentRepository: CommentRepositoryType
  threadRepository: ThreadRepositoryType
}

class AddCommentUseCase {
  _commentRepository: CommentRepositoryType
  _threadRepository: ThreadRepositoryType

  constructor ({ commentRepository, threadRepository }: AddCommentUseCaseType) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload: NewCommentType): Promise<CommentRepositoryType> {
    const { threadId } = useCasePayload

    await this._threadRepository.verifyThreadExists(threadId)
    const newComment: NewCommentType = new NewComment(useCasePayload)

    return await this._commentRepository.addComment(newComment)
  }
}

export default AddCommentUseCase
