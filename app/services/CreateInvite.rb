class CreateInvite
  MAX_RETRIES = 5

  def initialize(params)
    @user_id = params.fetch(:user_id)
  end

  def call
    user = User.find_by(id: @user_id)
    invite = Invite.find_or_initialize_by(user_id: @user_id)

    return invite if invite.persisted?

    if user.admin?
      invite.talent_invite = true
      invite.max_uses = nil
    elsif user.talent?
      invite.max_uses = nil
    end

    count = 0

    begin
      invite.code = Invite.generate_code

      invite.save!
    rescue ActiveRecord::RecordNotUnique
      count += 1
      retry if count <= MAX_RETRIES
    end
  end
end
