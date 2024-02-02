import UsersTableTestHelper from '../../../tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../tests/CommentsTableTestHelper'
import UserCommentLikesTableTestHelper from '../../../tests/UserCommentLikesTableTestHelper'
import pool from '../../database/postgres/pool'
import container from '../../container'
import createServer from '../createServer'

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await UserCommentLikesTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      }

      const loginRequestPayload = {
        username: 'dicoding',
        password: 'secret'
      }

      const threadRequestPayload = {
        title: 'Lorem',
        body: 'Lorem ipsum sit dolor'
      }

      const server = await createServer(container)

      // add user
      let response: any = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload
      })

      // login and get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginRequestPayload
      })

      const { data: { accessToken } } = response.result

      // Action
      response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
      expect(responseJson.data.addedThread.id).toBeDefined()
      expect(responseJson.data.addedThread.title).toBeDefined()
      expect(responseJson.data.addedThread.owner).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      }

      const loginRequestPayload = {
        username: 'dicoding',
        password: 'secret'
      }

      const threadRequestPayload = {
        title: 'Lorem'
      }

      const server = await createServer(container)

      // add user
      let response: any = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload
      })

      // login and get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginRequestPayload
      })

      const { data: { accessToken } } = response.result

      // Action
      response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      }

      const loginRequestPayload = {
        username: 'dicoding',
        password: 'secret'
      }

      const threadRequestPayload = {
        title: 'Lorem',
        body: ['Lorem ipsum sit dolor']
      }

      const server = await createServer(container)

      // add user
      let response: any = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload
      })

      // login and get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginRequestPayload
      })

      const { data: { accessToken } } = response.result

      // Action
      response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })

    it('should response 401 without authentication', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'Lorem',
        body: 'Lorem ipsum sit dolor'
      }

      const server = await createServer(container)

      // Action
      const response: any = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and get detail thread', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      }

      const loginRequestPayload = {
        username: 'dicoding',
        password: 'secret'
      }

      const threadRequestPayload = {
        title: 'Lorem',
        body: 'Lorem ipsum sit dolor'
      }

      const commentRequestPayload = {
        content: 'Lorem ipsum sit dolor'
      }

      const replyRequestPayload = {
        content: 'Lorem ipsum sit dolor'
      }

      const server = await createServer(container)

      // add user
      let response: any = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload
      })

      // login and get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginRequestPayload
      })

      const { data: { accessToken } } = response.result

      // add thread
      response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const { addedThread: { id: threadId } } = response.result.data
      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const { addedComment: { id: commentId } } = response.result.data
      response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: replyRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const { addedReply: { id: replyId } } = response.result.data
      response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Action
      response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread.id).toBeDefined()
      expect(responseJson.data.thread.title).toBeDefined()
      expect(responseJson.data.thread.body).toBeDefined()
      expect(responseJson.data.thread.date).toBeDefined()
      expect(responseJson.data.thread.username).toBeDefined()
      expect(responseJson.data.thread.comments).toBeDefined()
      expect(responseJson.data.thread.comments.length).toBe(1)
      expect(responseJson.data.thread.comments[0].likeCount).toBeDefined()
      expect(responseJson.data.thread.comments[0].likeCount).toBe(1)
      expect(responseJson.data.thread.comments[0].content).toBe('**komentar telah dihapus**')
      expect(responseJson.data.thread.comments[0].replies).toBeDefined()
      expect(responseJson.data.thread.comments[0].replies[0].content).toBe('**balasan telah dihapus**')
    })
  })
})
