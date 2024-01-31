interface PayloadType {
  commentId: string
  content: string
  owner: string
}

class NewReply {
  commentId: string
  content: string
  owner: string

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const { commentId, content, owner } = payload
    this.commentId = commentId
    this.content = content
    this.owner = owner
  }

  _verifyPayload ({ commentId, content, owner }: PayloadType): void {
    if (!commentId || !content || !owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof commentId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default NewReply
