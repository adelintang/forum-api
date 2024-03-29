interface PayloadType {
  title: string
  body: string
  owner: string
}

class NewThread {
  title: string
  body: string
  owner: string

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const { title, body, owner } = payload
    this.title = title
    this.body = body
    this.owner = owner
  }

  _verifyPayload ({ title, body, owner }: PayloadType): void {
    if (!title || !body || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default NewThread
