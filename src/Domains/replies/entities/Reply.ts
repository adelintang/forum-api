interface PayloadType {
  id: string
  username: string
  date: string
  content: string
  comment_id: string
  is_delete: string
}

class Reply {
  id: string
  username: string
  date: string
  content: string
  commentId: string

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const {
      id, username, date, content, comment_id, is_delete
    } = payload
    this.id = id
    this.username = username
    this.date = date
    this.content = is_delete === 'true' ? '**balasan telah dihapus**' : content
    this.commentId = comment_id
  }

  _verifyPayload ({
    id, username, date, content, comment_id: commentId, is_delete: isDelete
  }: PayloadType): void {
    if (!id || !username || !date || !content || !commentId || !isDelete) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof isDelete !== 'string' ||
      typeof commentId !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default Reply
