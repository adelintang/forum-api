interface PayloadType {
  id: string
  username: string
  date: string
  content: string
  is_delete: string
  count: string
}

class Comment {
  id: string
  username: string
  date: string
  content: string
  likeCount: number

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const {
      id, username, date, content, is_delete, count
    } = payload
    this.id = id
    this.username = username
    this.date = date
    this.content = is_delete === 'true' ? '**komentar telah dihapus**' : content
    this.likeCount = Number(count)
  }

  _verifyPayload ({
    id, username, date, content, is_delete, count
  }: PayloadType): void {
    if (!id || !username || !date || !content || !is_delete || !count) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof is_delete !== 'string' ||
      typeof count !== 'string'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default Comment
