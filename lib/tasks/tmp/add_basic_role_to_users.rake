namespace :users do
  task add_basic_role: :environment do
    User.where(role: nil).find_each do |user|
      user.update(role: "basic")
    end
  end
end
