import Thread from './Thread'

interface PayloadType {
  thread: ThreadType
  comments: CommentType[]
  replies: ReplyType[]
}

interface ThreadType {
  id: string
  title: string
  body: string
  date: string
  username: string
  comments?: CommentType[]
}

interface CommentType {
  id: string
  username: string
  date: string
  content: string
  is_delete: string
  count: string
  replies?: DetailRepliesType[]
}

interface ReplyType {
  id: string
  username: string
  date: string
  content: string
  is_delete: string
  commentId: string
}

// interface DetailCommentsType {
//   id: string
//   username: string
//   date: string
//   content: string
//   is_delete: string
//   count: string
//   replies: DetailRepliesType[]
// }

interface DetailRepliesType {
  id: string
  content: string
  date: string
  username: string
}

// interface DetailThreadType {
//   id: string
//   title: string
//   body: string
//   date: string
//   username: string
//   comments: DetailCommentsType[]
// }

class DetailThread {
  thread: ThreadType

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const { thread, comments, replies } = payload
    this.thread = new Thread(thread)
    this.thread.comments = comments.map((comment) => {
      const detailReplies = replies.filter((reply) => reply.commentId === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username
        }))
      comment.replies = detailReplies
      return comment
    })
  }

  _verifyPayload ({ thread, comments, replies }: PayloadType): void {
    if (!thread || !comments || !replies) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof thread !== 'object' || !Array.isArray(comments) || !Array.isArray(replies)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default DetailThread
