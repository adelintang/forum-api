import type { Server } from '@hapi/hapi'
import type { Container } from 'instances-container'
import CommentsHandler from './handler'
import routes from './routes'

interface ContainerType {
  container: Container
}

export default {
  name: 'comments',
  register: async (server: Server, { container }: ContainerType) => {
    const commentsHandler = new CommentsHandler(container)
    server.route(routes(commentsHandler))
  }
}
