namespace :rewards do
  task setup_old_talent_rewards: :environment do
    Invite.where(talent_invite: true).find_each do |invite|
      next if invite.user.admin?

      User.where(invite_id: invite.id).find_each do |user|
        if user.talent.token.contract_id.present?
          puts "FOUND A VALID USER ##{user.username} - rewarding the inviter ##{invite.user.username}"
          if Reward.where(user: invite.user, category: "talent_invite").count < 5
            Reward.create!(user: invite.user, amount: 250, category: "talent_invite")
          else
            Reward.create!(user: invite.user, amount: 100, category: "talent_invite")
          end

          invite.max_uses = invite.uses + 1
          invite.save
        end
      end
    end
  end
end
