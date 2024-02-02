import CommentsTableTestHelper from '../../../tests/CommentsTableTestHelper'
import ThreadsTableTestHelper from '../../../tests/ThreadsTableTestHelper'
import UserCommentLikesTableTestHelper from '../../../tests/UserCommentLikesTableTestHelper'
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper'
import container from '../../container'
import pool from '../../database/postgres/pool'
import createServer from '../createServer'

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await UserCommentLikesTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
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

      // Action
      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
      expect(responseJson.data.addedComment.id).toBeDefined()
      expect(responseJson.data.addedComment.content).toBeDefined()
      expect(responseJson.data.addedComment.owner).toBeDefined()
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
        title: 'Lorem',
        body: 'Lorem ipsum sit dolor'
      }

      const commentRequestPayload = {}

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

      // Action
      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat komen baru karena properti yang dibutuhkan tidak ada')
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
        body: 'Lorem ipsum sit dolor'
      }

      const commentRequestPayload = {
        content: ['lorem ipsum']
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

      // Action
      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          threadId,
          ...commentRequestPayload
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat komen baru karena tipe data tidak sesuai')
    })

    it('should response 401 without authentication', async () => {
      // Arrange
      const commentRequestPayload = {
        content: 'Lorem ipsum sit dolor'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: commentRequestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 when thread not exists', async () => {
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

      const commentRequestPayload = {
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

      // Action
      response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    describe('when DELETE /threads/{threadId}/comments', () => {
      it('should response 200 and delete comment', async () => {
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

        // Action
        response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const comment = await CommentsTableTestHelper.findCommentById(commentId)
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.status).toEqual('success')
        expect(comment[0].is_delete).toBe('true')
      })

      it('should response 401 without authentication', async () => {
        // Arrange
        const commentRequestPayload = {
          content: 'Lorem ipsum sit dolor'
        }

        const server = await createServer(container)

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123',
          payload: commentRequestPayload
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(401)
        expect(responseJson.message).toEqual('Missing authentication')
      })

      it('should response 403 when user not owned comment', async () => {
        // Arrange
        const userRequestPayload = {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }

        const userRequestPayloadTwo = {
          username: 'dicodingtwo',
          password: 'secret',
          fullname: 'Dicoding Indonesia Two'
        }

        const loginRequestPayload = {
          username: 'dicoding',
          password: 'secret'
        }

        const loginRequestPayloadTwo = {
          username: 'dicodingtwo',
          password: 'secret'
        }

        const threadRequestPayload = {
          title: 'Lorem',
          body: 'Lorem ipsum sit dolor'
        }

        const commentRequestPayload = {
          content: 'Lorem ipsum sit dolor'
        }

        const server = await createServer(container)

        // add user
        let response: any = await server.inject({
          method: 'POST',
          url: '/users',
          payload: userRequestPayload
        })

        response = await server.inject({
          method: 'POST',
          url: '/users',
          payload: userRequestPayloadTwo
        })

        // login and get token
        response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: loginRequestPayload
        })

        const { data: { accessToken } } = response.result

        response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: loginRequestPayloadTwo
        })

        const { data: { accessToken: accessTokenTwo } } = response.result

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

        // Action
        response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${accessTokenTwo}`
          }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(403)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('anda tidak memiliki akses')
      })

      it('should response 404 when thread not found', async () => {
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

        // Action
        response = await server.inject({
          method: 'DELETE',
          url: `/threads/xxx/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(404)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('thread tidak ditemukan')
      })

      it('should response 404 when comment not found', async () => {
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

        // Action
        response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/xxx`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(404)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('komen tidak ditemukan')
      })
    })

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
      it('should response 200 and like comment', async () => {
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
          body: 'Lorem ipsum site dolor'
        }

        const commentRequestPayload = {
          content: 'Lorem ipsum site dolor'
        }

        const server = await createServer(container)

        // add user
        let response: any = await server.inject({
          method: 'POST',
          url: '/users',
          payload: userRequestPayload
        })

        const { addedUser: { id: userId } } = response.result.data

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

        // Action
        response = await server.inject({
          method: 'PUT',
          url: `/threads/${threadId}/comments/${commentId}/likes`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const comment = await UserCommentLikesTableTestHelper.findLikeByCommentIdAndOwner(userId, commentId)
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.status).toEqual('success')
        expect(comment[0].comment_id).toBe(commentId)
        expect(comment[0].owner).toBe(userId)
      })

      it('should response 200 and unlike comment', async () => {
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

        const server = await createServer(container)

        // add user
        let response: any = await server.inject({
          method: 'POST',
          url: '/users',
          payload: userRequestPayload
        })

        const { addedUser: { id: userId } } = response.result.data

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
          method: 'PUT',
          url: `/threads/${threadId}/comments/${commentId}/likes`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Action
        response = await server.inject({
          method: 'PUT',
          url: `/threads/${threadId}/comments/${commentId}/likes`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const comment = await UserCommentLikesTableTestHelper
          .findLikeByCommentIdAndOwner(commentId, userId)
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.status).toEqual('success')
        expect(comment.length).toBe(0)
      })

      it('should response 401 without authentication', async () => {
        // Arrange
        const server = await createServer(container)

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes'
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(401)
        expect(responseJson.message).toEqual('Missing authentication')
      })

      it('should response 404 when thread not found', async () => {
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
          body: 'Lorem ipsum site dolor'
        }

        const commentRequestPayload = {
          content: 'Lorem ipsum site dolor'
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

        // Action
        response = await server.inject({
          method: 'PUT',
          url: `/threads/xxxx/comments/${commentId}/likes`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(404)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('thread tidak ditemukan')
      })

      it('should response 404 when comment not found', async () => {
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
          body: 'Lorem ipsum site dolor'
        }

        const commentRequestPayload = {
          content: 'Lorem ipsum site dolor'
        }

        const server = await createServer(container)

        let response: any = await server.inject({
          method: 'POST',
          url: '/users',
          payload: userRequestPayload
        })

        // login & get token
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

        // Action
        response = await server.inject({
          method: 'PUT',
          url: `/threads/${threadId}/comments/xxxx/likes`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(404)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('komen tidak ditemukan')
      })
    })
  })
})
