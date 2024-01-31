import Auth from '../Auth'

describe('Auth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'exampleAccessToken'
    }

    // Action and Assert
    expect(() => new Auth(payload)).toThrowError('AUTH.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'exampleAccessToken',
      refreshToken: 12345
    }

    // Action and Assert
    expect(() => new Auth(payload)).toThrowError('AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Auth entities correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'exampleAccessToken',
      refreshToken: 'exampleRefreshToken'
    }

    // Action
    const { accessToken, refreshToken } = new Auth(payload)

    // Assert
    expect(accessToken).toEqual(payload.accessToken)
    expect(refreshToken).toEqual(payload.refreshToken)
  })
})
