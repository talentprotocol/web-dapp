class ConfirmedUserGuard < Clearance::SignInGuard
  def call
    if user_confirmed?
      next_guard
    else
      failure("Confirm your email")
    end
  end

  def user_confirmed?
    if signed_in?
      current_user.email_confirmed_at.present?
    else
      true
    end
  end
end
