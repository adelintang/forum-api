import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

interface HandlerType {
  postThreadHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  getThreadHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
}

interface RoutesType {
  method: string
  path: string
  handler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  options?: { auth: string }
}

const routes = (handler: HandlerType): RoutesType[] => ([
  {
    method: 'POST',
    path: '/threads',
    handler: async (request, h) => await handler.postThreadHandler(request, h),
    options: {
      auth: 'forumapi_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: async (request, h) => await handler.getThreadHandler(request, h)
  }
])

export default routes
