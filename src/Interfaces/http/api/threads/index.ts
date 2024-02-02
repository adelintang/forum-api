import type { Container } from 'instances-container'
import type { Server } from '@hapi/hapi'
import ThreadsHandler from './handler'
import routes from './routes'

interface ContainerType {
  container: Container
}

export default {
  name: 'threads',
  register: async (server: Server, { container }: ContainerType) => {
    const threadsHandler = new ThreadsHandler(container)
    server.route(routes(threadsHandler))
  }
}
