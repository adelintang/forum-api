interface PayloadType {
  threadId: string
  content: string
  owner: string
}

class NewComment {
  threadId: string
  content: string
  owner: string

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const { threadId, content, owner } = payload
    this.threadId = threadId
    this.content = content
    this.owner = owner
  }

  _verifyPayload ({ threadId, content, owner }: PayloadType): void {
    if (!threadId || !content || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default NewComment
