namespace :invites do
  task update: :environment do
    puts "Starting task - Invites::Update"
    User.where.not(id: 2).find_each do |user|
      puts "User: #{user.username}"
      if user.talent?
        next
      elsif user.invite.present?
        user.update!(max_uses: 5)
      else
        service = CreateInvite.new(user_id: user.id)
        service.call
      end
    end
  end
end
