import NewThread from '../../Domains/threads/entities/NewThread'

interface NewThreadType {
  title: string
  body: string
  owner: string
}

interface ThreadRepositoryType {
  addThread: (newThread: NewThreadType) => Promise<void>
  verifyThreadExists: (newThread: NewThreadType) => Promise<void>
  getThreadById: (id: string) => Promise<void>
}

class AddThreadUseCase {
  _threadRepository: ThreadRepositoryType

  constructor ({ threadRepository }: { threadRepository: ThreadRepositoryType }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload: NewThreadType): Promise<any> {
    const newThread = new NewThread(useCasePayload)
    return await this._threadRepository.addThread(newThread)
  }
}

export default AddThreadUseCase
