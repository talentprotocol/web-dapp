class UserRegisteredGuard < Clearance::SignInGuard
  def call
    if user_confirmed?
      next_guard
    else
      failure("You need to register before being able to login")
    end
  end

  def user_confirmed?
    signed_in?
  end
end
