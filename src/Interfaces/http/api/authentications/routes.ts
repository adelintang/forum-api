import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

interface HandlerType {
  postAuthenticationHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  putAuthenticationHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  deleteAuthenticationHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
}

interface RoutesType {
  method: string
  path: string
  handler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
}

const routes = (handler: HandlerType): RoutesType[] => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: async (request, h) => await handler.postAuthenticationHandler(request, h)
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: async (request, h) => await handler.putAuthenticationHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: async (request, h) => await handler.deleteAuthenticationHandler(request, h)
  }
])

export default routes
