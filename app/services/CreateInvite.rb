class CreateInvite
  MAX_RETRIES = 5

  def initialize(params)
    @user_id = params.fetch(:user_id)
    @talent = params.fetch(:talent, false)
    @max_uses = params.fetch(:max_uses, 1)
  end

  def call
    invite = Invite.new
    invite.user_id = @user_id

    invite.talent_invite = @talent
    invite.max_uses = @max_uses

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
