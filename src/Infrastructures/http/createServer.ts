import type { Server } from '@hapi/hapi'
import type { Container } from 'instances-container'
import Hapi from '@hapi/hapi'
import Jwt from '@hapi/jwt'
import ClientError from '../../Commons/exceptions/ClientError'
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator'
import users from '../../Interfaces/http/api/users'
import authentications from '../../Interfaces/http/api/authentications'
import threads from '../../Interfaces/http/api/threads'
import comments from '../../Interfaces/http/api/comments'
import replies from '../../Interfaces/http/api/replies'

const createServer = async (container: Container | any): Promise<Server> => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts: any) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    },
    {
      plugin: threads,
      options: { container }
    },
    {
      plugin: comments,
      options: { container }
    },
    {
      plugin: replies,
      options: { container }
    }
  ])

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      value: 'Hello world!'
    })
  })

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan

      const translatedError: any = DomainErrorTranslator.translate(response)

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)
        return newResponse
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  return server
}

export default createServer
