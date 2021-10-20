namespace :users do
  task confirm_email: :environment do
    User.find_each do |user|
      user.confirm_email
    end
  end
end
