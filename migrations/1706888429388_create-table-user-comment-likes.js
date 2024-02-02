exports.up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })
  pgm.addConstraint('user_comment_likes', 'unique_comment_id_and_owner', 'UNIQUE(comment_id,owner)')
  pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE')
  pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropConstraint('user_comment_likes', 'unique_comment_id_and_owner')
  pgm.dropConstraint('user_comment_likes', 'fk_replies.comment_id_comments.id')
  pgm.dropConstraint('user_comment_likes', 'fk_replies.owner_users.id')
  pgm.dropTable('user_comment_likes')
}
