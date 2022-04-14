namespace :quests do
  task populate: :environment do
    puts "starting rake task to populate quests"

    User.all.find_each do |user|
      Quests::PopulateForUser.new.call(user: user)
    end

    puts "done!"
  end
end
