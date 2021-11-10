namespace :machine do
  task prime: ["db:seed"] do
    puts "Setting up Admin user"

    user = User.create!(
      username: "Talent Protocol",
      email: "admin@talentprotocol.com",
      wallet_id: "0x#{SecureRandom.hex(32)}",
      password: SecureRandom.base64(12),
      role: "admin",
      email_confirmed_at: Time.current
    )
    user.create_investor!
    user.create_talent!
    user.create_feed!

    user.talent.create_token!(
      ticker: "TAL"
    )
    post = Post.create!(text: "Hello world!", user: user)
    user.feed.posts << post

    post = Post.create!(text: "Everyone, welcome to Talent Protocol's Private Beta. We're excited to have you here, you can start by looking up Talent, you can already interact with the profiles from the core team.\n\nIf you have any issues, find any bugs or just have some form of feedback, please do let us know!", user: user)
    user.feed.posts << post

    puts "Setting up invites.."

    invite = Invite.new
    invite.user = user
    invite.talent_invite = true
    invite.code = Invite.generate_code
    invite.save!

    puts "Your invite that creates talents is: ##{invite.id} - #{invite.code}"

    invite = Invite.new
    invite.user = user
    invite.talent_invite = false
    invite.code = Invite.generate_code
    invite.save!

    puts "Your invite that creates supporters is: ##{invite.id} - #{invite.code}"
  end
end
