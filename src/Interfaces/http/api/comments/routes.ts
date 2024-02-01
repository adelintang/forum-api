import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

interface HandlerType {
  postCommentHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  deleteCommentHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
  putLikeCommentHandler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
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
    path: '/threads/{threadId}/comments',
    handler: async (request, h) => await handler.postCommentHandler(request, h),
    options: {
      auth: 'forumapi_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: async (request, h) => await handler.deleteCommentHandler(request, h),
    options: {
      auth: 'forumapi_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: async (request, h) => await handler.putLikeCommentHandler(request, h),
    options: {
      auth: 'forumapi_jwt'
    }
  }
])

export default routes
