class UpdateUserMetadataGuard < Clearance::SignInGuard
  def call
    if update_metadata
      next_guard
    else
      failure("Unable to update user metadata")
    end
  end

  def update_metadata
    if current_user.present?
      current_user.sign_in_count += 1
      current_user.last_sign_in_at = Time.current
      current_user.save
    end
  end
end
