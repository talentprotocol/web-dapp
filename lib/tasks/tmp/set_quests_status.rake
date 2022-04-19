namespace :quests do
  task set_status: :environment do
    puts "starting rake task to set quests status"

    User.all.order(:id).find_in_batches(start: ENV["START"]) do |batch|
      batch.each do |user|
        user_type = user.investor || user.talent

        if user.wallet_id
          Quests::Update.new.call(type: "Tasks::ConnectWallet", user: user, create_notif: false)

          if user_type&.occupation && user_type&.headline
            Quests::Update.new.call(type: "Tasks::FillInAbout", user: user, create_notif: false)
          end
        end

        if Follow.where(follower_id: user.id).count > 2
          Quests::Update.new.call(type: "Tasks::Watchlist", user: user, create_notif: false)
        end

        if user.tokens_purchased
          Quests::Update.new.call(type: "Tasks::BuyTalentToken", user: user, create_notif: false)
        end

        if user.talent&.public
          Quests::Update.new.call(type: "Tasks::PublicProfile", user: user, create_notif: false)
        end

        if ProfilePageVisitor.where(user: user).count > 9
          Quests::Update.new.call(type: "Tasks::ShareProfile", user: user, create_notif: false)
        end

        if user.talent&.token
          Quests::Update.new.call(type: "Tasks::LaunchToken", user: user, create_notif: false)
        end

        if user.invites.sum(:uses) > 4
          Reward.create!(user: user, amount: 50, category: "quest", reason: "Got 5 people to register")
          Quests::Update.new.call(type: "Tasks::Register", user: user, create_notif: false)
        end
      rescue
        puts "error updating quests for user #{user.username} - #{user.id}"
      end
    end

    puts "done"
  end
end
