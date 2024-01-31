interface NewCommentType {
  id: string
  content: string
  owner: string
}

class CommentRepository {
  async addComment (newComment: NewCommentType): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteComment (id: string): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentOwner (id: string, owner: string): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentsByThreadId (threadId: string): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentExists (id: string): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

export default CommentRepository
