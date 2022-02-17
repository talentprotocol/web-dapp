# frozen_string_literal: true

class Supporter::UpgradeToTalent
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
    supporter_invite = user.invites.find_by(talent_invite: false)
    if supporter_invite
      supporter_invite.update!(max_uses: nil)
    else
      service = CreateInvite.new(user_id: user.id)
      service.call
    end
  end
end
