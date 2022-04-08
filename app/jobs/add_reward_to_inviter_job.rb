class AddRewardToInviterJob < ApplicationJob
  queue_as :default

  def perform(token_id)
    token = Token.find token_id

    if token.contract_id.present?
      invite = Invite.find(token.talent.user.invite_id)
      user = invite.user

      return if user.admin?

      if Reward.where(user: user, category: "talent_invite").count < 5
        Reward.create!(user: user, amount: 250, category: "talent_invite")
      else
        Reward.create!(user: user, amount: 100, category: "talent_invite")
      end

      invite.max_uses = invite.uses + 1
      invite.save
    end
  end
end
