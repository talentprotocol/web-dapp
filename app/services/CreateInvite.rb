class CreateInvite
  MAX_RETRIES = 5

  def initialize(params)
    @user_id = params.fetch(:user_id)
    @single_use = params.fetch(:single_use, false)
  end

  def call
    user = User.find_by(id: @user_id)
    invite = Invite.new

    invite.user = user
    invite.talent_invite = false

    invite.max_uses =
      if @single_use
        1
      else
        5
      end

    count = 0

    begin
      invite.code = Invite.generate_code

      invite.save!
    rescue ActiveRecord::RecordNotUnique
      count += 1
      retry if count <= MAX_RETRIES
    end

    invite
  end
end
