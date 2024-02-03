import ReplyRepository from '../ReplyRepository'

describe('ReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    interface ReplyRepositoryType {
      addReply: (newReply: PayloadType) => Promise<any>
      deleteReply: (id: string) => Promise<void>
      verifyReplyOwner: (id: string, owner: string) => Promise<void>
      getRepliesByThreadId: (threadId: string) => Promise<any>
    }

    interface PayloadType {
      commentId: any
      content: string
      owner: string
    }

    const replyRepository: ReplyRepositoryType = new ReplyRepository()

    // Action and Assert
    await expect(replyRepository.addReply({
      commentId: undefined,
      content: '',
      owner: ''
    })).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.verifyReplyOwner('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.getRepliesByThreadId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
