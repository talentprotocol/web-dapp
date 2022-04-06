class AddRewardToInviterJob < ApplicationJob
  queue_as :default

  def perform(token_id)
    token = Token.find token_id

    if token.contract_id.present?
      invite = Invite.find(token.talent.user.invite_id)
      user = invite.user

      return if user.admin?

      if Reward.where(user: user, category: "TALENT_INVITE").count > 5
        Reward.create!(user: user, amount: 250, category: "TALENT_INVITE")
      else
        Reward.create!(user: user, amount: 100, category: "TALENT_INVITE")
      end

      invite.max_uses = invite.uses + 1
    end
  end
end
