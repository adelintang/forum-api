import type { Server } from '@hapi/hapi'
import type { Container } from 'instances-container'
import RepliesHandler from './handler'
import routes from './routes'

interface ContainerType {
  container: Container
}

module.exports = {
  name: 'replies',
  register: async (server: Server, { container }: ContainerType) => {
    const repliesHandler = new RepliesHandler(container)
    server.route(routes(repliesHandler))
  }
}
