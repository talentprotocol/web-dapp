namespace :quests do
  task set_status: :environment do
    puts "starting rake task to set quests status"

    User.all.find_each do |user|
      user_type = user.investor || user.talent

      if user.wallet_id
        UpdateQuestJob.perform_later(title: "Connect wallet", user_id: user.id)

        if user_type&.occupation && user_type&.headline
          UpdateQuestJob.perform_later(title: "Fill in About", user_id: user.id)
        end
      end

      if Follow.where(follower_id: user.id).count > 2
        UpdateQuestJob.perform_later(title: "Add 3 talent to watchlist", user_id: user.id)
      end

      if user.tokens_purchased
        UpdateQuestJob.perform_later(title: "Buy a Talent Token", user_id: user.id)
      end

      if user.talent&.public
        UpdateQuestJob.perform_later(title: "Complete Profile and set it public", user_id: user.id)
      end

      if ProfilePageVisitor.where(user: user).count > 9
        UpdateQuestJob.perform_later(title: "Get your profile out there", user_id: user.id)
      end

      if user.talent&.token
        UpdateQuestJob.perform_later(title: "Launch your token", user_id: user.id)
      end

      if user.invites.sum(:uses) > 4
        Reward.create!(user: user, amount: 50, category: "quest", reason: "Got 5 people to register")
        UpdateQuestJob.perform_later(title: "Get 5 people to register", user_id: user.id)
      end
    end

    puts "done"
  end
end
