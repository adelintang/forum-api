interface PayloadType {
  username: string
  password: string
}

class LoginUser {
  username: string
  password: string

  constructor (payload: PayloadType) {
    this._verifyPayload(payload)

    const { username, password } = payload
    this.username = username
    this.password = password
  }

  _verifyPayload ({ username, password }: PayloadType): void {
    if (!username || !password) {
      throw new Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

export default LoginUser
