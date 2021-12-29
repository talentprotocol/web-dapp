namespace :invites do
  task update: :environment do
    puts "Starting task - Invites::Update"
    User.where.not(id: 2).find_each do |user|
      puts "User: #{user.username}"
      if user.talent?
        next
      elsif user.invite.present?
        user.invite.update!(max_uses: 0)
      end
    end
  end
end
