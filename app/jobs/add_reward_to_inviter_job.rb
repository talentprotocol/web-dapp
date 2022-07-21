class AddRewardToInviterJob < ApplicationJob
  queue_as :default

  def perform(token_id)
    token = Token.find token_id

    if token.contract_id.present?
      invite = Invite.find_by(id: token.talent.user.invite_id)
      return unless invite

      user = invite.user

      return if user.admin?

      Reward.create!(user: user, amount: 250, category: "talent_invite")

      Tasks::Update.new.call(type: "Tasks::InviteTokenLaunch", user: user) if invite.uses >= 5

      invite.max_uses = invite.uses + 1
      invite.save
    end
  end
end
