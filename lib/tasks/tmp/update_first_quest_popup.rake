namespace :users do
  task update_first_quest_popup: :environment do
    puts "starting rake task to update first quest pop up bool"

    User.all.order(:id).find_in_batches(start: ENV["START"], finish: ENV["FINISH"]) do |batch|
      batch.each do |user|
        user.update!(first_quest_popup: true) if user.quests.pluck(:status).include?("done")
      rescue
        puts "error updating first quest pop up for #{user.username} - #{user.id}"
      end
    end
    puts "done!"
  end
end
