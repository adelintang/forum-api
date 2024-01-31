import DetailThread from '../../Domains/threads/entities/DetailThread'

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

interface DetailThreadUseCaseType {
  commentRepository: CommentRepositoryType
  threadRepository: ThreadRepositoryType
  replyRepository: ReplyRepositoryType
}

interface ThreadType {
  id: string
  title: string
  body: string
  date: string
  username: string
}

interface CommentsType {
  id: string
  date: string
  content: string
  is_delete: string
  username: string
}

interface RepliesType {
  id: string
  comment_id: string
  date: string
  content: string
  is_delete: string
  username: string
}

class DetailThreadUseCase {
  _commentRepository: CommentRepositoryType
  _threadRepository: ThreadRepositoryType
  _replyRepository: ReplyRepositoryType

  constructor ({ commentRepository, threadRepository, replyRepository }: DetailThreadUseCaseType) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload: { threadId: string }): Promise<any> {
    const { threadId } = useCasePayload

    const thread: ThreadType | any = await this._threadRepository.getThreadById(threadId)
    const comments: CommentsType[] | any = await this._commentRepository.getCommentsByThreadId(threadId)
    const replies: RepliesType[] | any = await this._replyRepository.getRepliesByThreadId(threadId)

    return new DetailThread({
      thread, comments, replies
    })
  }
}

export default DetailThreadUseCase
