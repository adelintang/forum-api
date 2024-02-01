import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

interface HandlerType {
  postUserHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
}

interface RoutesType {
  method: string
  path: string
  handler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
}

const routes = (handler: HandlerType): RoutesType[] => ([
  {
    method: 'POST',
    path: '/users',
    handler: async (request, h) => await handler.postUserHandler(request, h)
  }
])

export default routes
