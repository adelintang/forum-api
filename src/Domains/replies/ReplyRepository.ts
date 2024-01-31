interface NewReplyType {
  commentId: string
  content: string
  owner: string
}

class ReplyRepository {
  async addReply (newReply: NewReplyType): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteReply (id: string): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyReplyOwner (id: string, owner: string): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getRepliesByThreadId (threadId: string): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

export default ReplyRepository
