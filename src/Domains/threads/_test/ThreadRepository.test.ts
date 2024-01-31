import ThreadRepository from '../ThreadRepository'

describe('ThreadRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadRepository = new ThreadRepository()

    // Action and Assert
    await expect(threadRepository.addThread({
      title: '',
      body: '',
      owner: ''
    })).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadRepository.verifyThreadExists({
      title: '',
      body: '',
      owner: ''
    })).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
