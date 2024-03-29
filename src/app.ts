import 'dotenv/config'
import createServer from './Infrastructures/http/createServer'
import container from './Infrastructures/container'

const init = async (): Promise<void> => {
  const server = await createServer(container)
  await server.start()
  console.log(`server start at ${server.info.uri}`)
}

void init()
