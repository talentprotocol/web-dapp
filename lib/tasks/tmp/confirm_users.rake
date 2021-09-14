namespace :demo do
  task create: :environment do
    User.find_each do |user|
      user.confirm_email
    end
  end
end
