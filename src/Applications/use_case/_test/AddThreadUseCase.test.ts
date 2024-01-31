import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import AddedThread from '../../../Domains/threads/entities/AddedThread'
import NewThread from '../../../Domains/threads/entities/NewThread'
import AddThreadUseCase from '../AddThreadUseCase'

interface NewThreadType {
  title: string
  body: string
  owner: string
}

interface ThreadRepositoryType {
  addThread: (newThread: NewThreadType) => Promise<any>
  verifyThreadExists: (newThread: NewThreadType) => Promise<void>
  getThreadById: (id: string) => Promise<void>
}

describe('AddedThreadUseCase', () => {
  it('should should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Lorem',
      body: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'John Doe'
    })

    const mockThreadRepository: ThreadRepositoryType = new ThreadRepository()
    mockThreadRepository.addThread = jest.fn(async () => await Promise.resolve(mockAddedThread))

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: 'Lorem',
      body: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    }))
    expect(addedThread).toEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'John Doe'
    }))
  })
})
