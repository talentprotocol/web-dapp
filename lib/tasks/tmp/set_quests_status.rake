namespace :quests do
  task set_status: :environment do
    puts "starting rake task to set quests status"

    User.all.find_each do |user|
      user_type = user.investor || user.talent

      if user.wallet_id
        Quests::Update.new.call(title: "Connect wallet", user: user, create_notif: false)

        if user_type&.occupation && user_type&.headline
          Quests::Update.new.call(title: "Fill in About", user: user, create_notif: false)
        end
      end

      if Follow.where(follower_id: user.id).count > 2
        Quests::Update.new.call(title: "Add 3 talent to watchlist", user: user, create_notif: false)
      end

      if user.tokens_purchased
        Quests::Update.new.call(title: "Buy a Talent Token", user: user, create_notif: false)
      end

      if user.talent&.public
        Quests::Update.new.call(title: "Complete Profile and set it public", user: user, create_notif: false)
      end

      if ProfilePageVisitor.where(user: user).count > 9
        Quests::Update.new.call(title: "Get your profile out there", user: user, create_notif: false)
      end

      if user.talent&.token
        Quests::Update.new.call(title: "Launch your token", user: user, create_notif: false)
      end

      if user.invites.sum(:uses) > 4
        Reward.create!(user: user, amount: 50, category: "quest", reason: "Got 5 people to register")
        Quests::Update.new.call(title: "Get 5 people to register", user: user, create_notif: false)
      end
    end

    puts "done"
  end
end
