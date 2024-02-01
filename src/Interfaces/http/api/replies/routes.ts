import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

interface HandlerType {
  postReplyHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  deleteReplyHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
}

interface RoutesType {
  method: string
  path: string
  handler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  options: { auth: string }
}

const routes = (handler: HandlerType): RoutesType[] => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: async (request, h) => await handler.postReplyHandler(request, h),
    options: {
      auth: 'forumapi_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: async (request, h) => await handler.deleteReplyHandler(request, h),
    options: {
      auth: 'forumapi_jwt'
    }
  }
])

export default routes
