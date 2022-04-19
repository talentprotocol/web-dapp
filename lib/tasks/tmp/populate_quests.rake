namespace :quests do
  task populate: :environment do
    puts "starting rake task to populate quests"

    User.all.order(:id).find_in_batches(start: ENV["START"]) do |batch|
      batch.each do |user|
        Quests::PopulateForUser.new.call(user: user)
      rescue
        puts "error populating quests for user #{user.username} - #{user.id}"
      end
    end
    puts "done!"
  end
end
