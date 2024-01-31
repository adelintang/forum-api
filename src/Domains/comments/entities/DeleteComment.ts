interface PayloadType {
  threadId: string
  commentId: string
  owner: string
}

class DeleteComment {
  threadId: string
  commentId: string
  owner: string

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const { threadId, commentId, owner } = payload
    this.threadId = threadId
    this.commentId = commentId
    this.owner = owner
  }

  _verifyPayload ({ threadId, commentId, owner }: PayloadType): void {
    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default DeleteComment
