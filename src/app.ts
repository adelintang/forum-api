import Hapi from '@hapi/hapi'

const init = async (): Promise<void> => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

void init()
