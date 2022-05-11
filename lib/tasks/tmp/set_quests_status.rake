namespace :quests do
  task set_status: :environment do
    puts "starting rake task to set quests status"

    User.all.order(:id).find_in_batches(start: ENV["START"], finish: ENV["FINISH"]) do |batch|
      batch.each do |user|
        user_type = user.talent || user.investor

        talent_invite = user.invites.find_by(talent_invite: true)
        invitees_token_count = talent_invite.present? ? talent_invite.invitees.joins(talent: [:token]).where(tokens: {deployed: true}).count : 0
        
        if user.wallet_id
          Tasks::Update.new.call(type: "Tasks::ConnectWallet", user: user, normal_update: false)

          if user_type&.occupation && user_type&.headline
            Tasks::Update.new.call(type: "Tasks::FillInAbout", user: user, normal_update: false)
          end
        end

        if Follow.where(follower_id: user.id).count > 2
          Tasks::Update.new.call(type: "Tasks::Watchlist", user: user, normal_update: false)
        end

        if user.tokens_purchased
          Tasks::Update.new.call(type: "Tasks::BuyTalentToken", user: user, normal_update: false)
        end

        if user.talent&.public
          Tasks::Update.new.call(type: "Tasks::PublicProfile", user: user, normal_update: false)
        end

        if ProfilePageVisitor.where(user: user).count > 9
          Tasks::Update.new.call(type: "Tasks::ShareProfile", user: user, normal_update: false)
        end

        if user.talent&.token
          Tasks::Update.new.call(type: "Tasks::LaunchToken", user: user, normal_update: false)
          Tasks::Update.new.call(type: "Tasks::ShareProfile", user: user, normal_update: false)
          Tasks::Update.new.call(type: "Tasks::PublicProfile", user: user, normal_update: false)
        end

        if invitees_token_count >= 5
          Tasks::Update.new.call(type: "Tasks::Register", user: user, normal_update: true)
        end

      rescue
        puts "error updating quests for user #{user.username} - #{user.id}"
      end
    end

    puts "done"
  end
end
