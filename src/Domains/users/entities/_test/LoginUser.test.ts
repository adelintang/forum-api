import LoginUser from '../LoginUser'

interface PayloadType {
  username: string
  password: string
}

describe('LoginUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange

    const payload: PayloadType = {
      username: 'dicodingstudent',
      password: ''
    }

    // Action and Assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload: { username: string, password: any } = {
      username: 'dicodingstudent',
      password: 23456
    }

    // Action and Assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create LoginUser object correctly', () => {
    // Arrange
    const payload: PayloadType = {
      username: 'dicodingstudent',
      password: '23456'
    }

    // Action
    const { username, password } = new LoginUser(payload)

    // Assert
    expect(username).toEqual(payload.username)
    expect(password).toEqual(payload.password)
  })
})
