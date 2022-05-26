namespace :users do
  task update_profile_type: :environment do
    puts "updating users"
    User.find_each do |user|
      if user.profile_type == "investor" && user.talent.present?
        user.update!(profile_type: "talent")
      end
    end
    puts "users updated"
  end
end
