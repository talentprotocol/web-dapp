class DisableUser
  def call(user)
    user.update!(disabled: true)
    user.reset_remember_token!
  end
end
