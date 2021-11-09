namespace :invites do
  task update: :environment do
    puts "Starting task - Invites::Update"
    User.where.not(id: 2).find_each do |user|
      puts "User: #{user.username}"
      if user.talent?
        invite = user.invite

        if invite.nil?
          invite = Invite.new
          invite.user = user
          invite.code = Invite.generate_code
        end

        invite.max_uses = 5
        invite.uses = 0
        invite.talent_invite = false
        invite.save!
        puts "  - Talent user: invite #{invite.code} updated"
      elsif user.invite.present?
        puts "  - Not talent, invite destroyed"
        user.invite.destroy
      end
    end
  end
end
