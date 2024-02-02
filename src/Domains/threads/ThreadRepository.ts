interface NewThreadType {
  title: string
  body: string
  owner: string
}

class ThreadRepository {
  async addThread (newThread: NewThreadType): Promise<any> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyThreadExists (id: string): Promise<void> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getThreadById (id: string): Promise<any> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

export default ThreadRepository
