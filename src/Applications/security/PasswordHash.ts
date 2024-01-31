class PasswordHash {
  async hash (password: string): Promise<void> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  }

  async comparePassword (plain: string, encrypted: string): Promise<void> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  }
}

export default PasswordHash
