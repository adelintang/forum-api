import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager'
import InvariantError from '../../Commons/exceptions/InvariantError'

interface JwtType {
  generate: (payload: PayloadType, salt: string) => Promise<any>
  decode: (token: string) => Promise<any>
  verify: (payload: any, salt: string) => Promise<any>
}

interface PayloadType {
  username: string
  id: string
}

class JwtTokenManager extends AuthenticationTokenManager {
  _jwt: JwtType

  constructor (jwt: JwtType | any) {
    super()
    this._jwt = jwt
  }

  async createAccessToken (payload: PayloadType): Promise<string> {
    return await this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY as unknown as string)
  }

  async createRefreshToken (payload: PayloadType): Promise<string> {
    return await this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY as unknown as string)
  }

  async verifyRefreshToken (token: string): Promise<void> {
    try {
      const artifacts = this._jwt.decode(token) as unknown as string
      void this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY as unknown as string)
    } catch (error) {
      throw new InvariantError('refresh token tidak valid')
    }
  }

  async decodePayload (token: string): Promise<any> {
    const artifacts: any = this._jwt.decode(token)
    return artifacts.decoded.payload
  }
}

export default JwtTokenManager
