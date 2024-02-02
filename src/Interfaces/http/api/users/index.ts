import type { Container } from 'instances-container'
import type { Server } from '@hapi/hapi'
import UsersHandler from './handler'
import routes from './routes'

interface ContainerType {
  container: Container
}

export default {
  name: 'users',
  register: async (server: Server, { container }: ContainerType) => {
    const usersHandler = new UsersHandler(container)
    server.route(routes(usersHandler))
  }
}
