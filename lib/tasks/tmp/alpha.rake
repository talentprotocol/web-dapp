namespace :alpha do
  task prime: ["db:seed"] do
    puts "Setting up Alert configurations.."

    AlertConfiguration.create!(
      page: "/feed",
      alert_type: "primary",
      text: "Apply to launch your Career Token on Talent Protocol",
      href: "https://www.talentprotocol.com/invite",
      button_text: "Reserve $TICKER"
    )

    puts "Setting up Admin user"

    user = User.create!(
      username: "Talent Protocol",
      email: "admin@talentprotocol.com",
      wallet_id: "0x#{SecureRandom.hex(32)}",
      password: SecureRandom.base64(12),
      role: "admin"
    )
    user.create_investor!
    user.create_talent!
    user.create_feed!

    user.talent.create_token!(
      ticker: "TAL",
      price: 2,
      market_cap: 0
    )
    post = Post.create!(text: "Hello world!", user: user)
    user.feed.posts << post

    post = Post.create!(text: "Everyone, welcome to Talent Protocol's secret Alpha. We're excited to have you here, you can start by looking up Talents, you can already interact with the profiles from the core team.\n\nIf you have any issues, find any bugs or just have some form of feedback, please do let us know!", user: user)
    user.feed.posts << post
  end
end
