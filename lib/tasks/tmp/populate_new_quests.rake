namespace :quests do
  task populate_new: :environment do
    puts "starting rake task to populate talent profile, talent token & ambassador quests"

    service = Tasks::Update.new

    User.all.order(:id).find_in_batches(start: ENV["START"]) do |batch|
      batch.each do |user|
        talent = user.try(:talent)
        talent_invite = user.invites.find_by(talent_invite: true)
        invitees_token_count = talent_invite.present? ? talent_invite.invitees.joins(talent: [:token]).where(tokens: {deployed: true}).count : 0

        # ---------------------------------------------------

        talent_profile_quest = Quests::TalentProfile.find_or_create_by!(user: user)

        Tasks::Highlights.find_or_create_by!(quest: talent_profile_quest)
        service.call(type: "Tasks::Highlights", user: user, normal_update: false) if (talent.try(:milestones).try(:length) || 0) > 0

        Tasks::Goals.find_or_create_by!(quest: talent_profile_quest)
        service.call(type: "Tasks::Goals", user: user, normal_update: false) if (talent.try(:career_goal).try(:goals).try(:length) || 0) > 0

        # ---------------------------------------------------

        talent_token_quest = Quests::TalentToken.find_or_create_by!(user: user)

        Tasks::ApplyTokenLaunch.find_or_create_by!(quest: talent_token_quest)
        service.call(type: "Tasks::ApplyTokenLaunch", user: user, normal_update: false) unless user.profile_type == "supporter"

        talent_quest = Quests::Talent.find_by(user: user)
        if talent_quest.present?
          talent_task = Tasks::LaunchToken.find_by(quest: talent_quest)
          talent_task.update!(quest: talent_token_quest) if talent_task.present?
          talent_quest.destroy
        else
          Tasks::LaunchToken.find_or_create_by!(quest: talent_token_quest)
        end
        service.call(type: "Tasks::LaunchToken", user: user, normal_update: false) if talent.try(:token).try(:deployed_at)

        Tasks::Perks.find_or_create_by!(quest: talent_token_quest)
        service.call(type: "Tasks::Perks", user: user, normal_update: false) if (talent.try(:perks).try(:length) || 0) > 0

        # ---------------------------------------------------

        ambassdor_quest = Quests::Ambassador.find_or_create_by!(user: user)

        scout_quest = Quests::Scout.find_by(user: user)
        if scout_quest.present?
          register_task = Tasks::Register.find_by(quest: scout_quest)
          register_task.update!(quest: ambassdor_quest) if register_task.present?
        else
          Tasks::Register.find_or_create_by!(quest: ambassdor_quest)
        end
        service.call(type: "Tasks::Register", user: user, normal_update: false) if (talent_invite.try(:uses) || 0) > 4

        # ---------------------------------------------------

        Tasks::InviteTokenLaunch.find_or_create_by!(quest: scout_quest)
        service.call(type: "Tasks::InviteTokenLaunch", user: user, normal_update: false) if invitees_token_count > 4

      rescue
        puts "error populating quests for user #{user.username} - #{user.id}"
      end
    end
    puts "done!"
  end
end
