interface PayloadType {
  id: string
  title: string
  body: string
  date: string
  username: string
}

class Thread {
  id: string
  title: string
  body: string
  date: string
  username: string

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const {
      id, title, body, date, username
    } = payload
    this.id = id
    this.title = title
    this.body = body
    this.date = date
    this.username = username
  }

  _verifyPayload ({
    id, title, body, date, username
  }: PayloadType): void {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default Thread
