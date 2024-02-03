import Jwt from '@hapi/jwt'
import InvariantError from '../../../Commons/exceptions/InvariantError'
import JwtTokenManager from '../JwtTokenManager'

interface PayloadType {
  username: string
  id: string
}

interface JwtTokenManagerType {
  createRefreshToken: (payload: PayloadType) => Promise<any>
  createAccessToken: (payload: PayloadType) => Promise<any>
  verifyRefreshToken: (token: string) => Promise<void>
  decodePayload: (token: string) => Promise<void>
}

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload: PayloadType = {
        username: 'dicoding',
        id: 'user-123'
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      }
      const jwtTokenManager: JwtTokenManagerType = new JwtTokenManager(mockJwtToken)

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY)
      expect(accessToken).toEqual('mock_token')
    })
  })

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
        id: 'user-123'
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      }
      const jwtTokenManager: JwtTokenManagerType = new JwtTokenManager(mockJwtToken)

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY)
      expect(refreshToken).toEqual('mock_token')
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'dicoding',
        id: ''
      })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError)
    })

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: 'dicoding',
        id: ''
      })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError)
    })
  })

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'dicoding',
        id: ''
      })

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken)

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding')
    })
  })
})
