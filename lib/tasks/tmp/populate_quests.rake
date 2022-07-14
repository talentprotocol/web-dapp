namespace :quests do
  task populate: :environment do
    puts "starting rake task to populate quests"

    User.all.order(:id).find_in_batches(start: ENV["START"]) do |batch|
      batch.each do |user|
        Tasks::PopulateForUser.new.call(user: user)
      rescue
        puts "error populating quests for user #{user.username} - #{user.id}"
      end
    end
    puts "done!"
  end

  task populate_verified_quest: :environment do
    puts "starting rake task to populate verified quest"

    User.all.order(:id).find_in_batches(start: ENV["START"]) do |batch|
      batch.each do |user|
        verify_profile_quest = Quests::VerifiedProfile.find_or_create_by!(user: user)

        Tasks::Verified.find_or_create_by!(quest: verify_profile_quest)
      rescue
        puts "error populating quests for user #{user.username} - #{user.id}"
      end
    end
    puts "done!"
  end
end
