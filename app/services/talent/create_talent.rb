# frozen_string_literal: true

class Talent::CreateTalent
  def call(user_id:)
    user = User.find(user_id)

    user.create_talent!
    user.talent.create_career_goal!
    user.talent.create_token!

    create_invite(user)

    service = Mailerlite::SyncSubscriber.new
    service.call(user)

    user.talent
  end

  private

  def create_invite(user)
    if user.invite
      user.invite.update!(max_uses: nil)
    else
      service = CreateInvite.new(user_id: user.id)
      service.call
    end
  end
end
