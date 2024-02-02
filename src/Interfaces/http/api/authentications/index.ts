import type { Server } from '@hapi/hapi'
import type { Container } from 'instances-container'
import routes from './routes'
import AuthenticationsHandler from './handler'

interface ContainerType {
  container: Container
}

export default {
  name: 'authentications',
  register: async (server: Server, { container }: ContainerType) => {
    const authenticationsHandler = new AuthenticationsHandler(container)
    server.route(routes(authenticationsHandler))
  }
}
