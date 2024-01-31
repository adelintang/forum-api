import LoginUser from '../LoginUser'

describe('LoginUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload: { username: string } = {
      username: 'dicodingstudent'
    }

    // Action and Assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload: { username: string, password: number } = {
      username: 'dicodingstudent',
      password: 23456
    }

    // Action and Assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create LoginUser object correctly', () => {
    // Arrange
    const payload = {
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
