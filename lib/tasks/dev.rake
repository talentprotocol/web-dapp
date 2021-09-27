if Rails.env.development?
  namespace :dev do
    task prime: ["db:setup", "db:seed"] do
      puts "Setting up Alert configurations.."
      AlertConfiguration.create!(
        page: "/talent",
        alert_type: "primary",
        text: "Connect your wallet to buy Carrer Tokens",
        href: "https://metamask.io/",
        button_text: "Connect MetaMask",
        css_class: "w-100"
      )

      AlertConfiguration.create!(
        page: "/feed",
        alert_type: "primary",
        text: "Apply to launch your Career Token on Talent Protocol",
        href: "https://www.talentprotocol.com/invite",
        button_text: "Reserve $TICKER"
      )

      puts "Setting up Users.."
      admin = User.create!(
        username: "Admin",
        email: "admin@talentprotocol.com",
        password: "password",
        role: "admin"
      )

      investor = User.create!(
        username: "Investor",
        wallet_id: "0x123",
        email: "investor@talentprotocol.com",
        password: "password",
      )

      talent = User.create!(
        username: "Elon Musk",
        wallet_id: "0x1234444",
        email: "elon@talentprotocol.com",
        password: "password",
      )

      talent2 = User.create!(
        username: "Karl Marx",
        wallet_id: "0x12345",
        email: "talent2@talentprotocol.com",
        password: "password",
      )

      puts "Setting up Investors.."
      admin_investor = Investor.create!(
        description: "I own this",
        user: admin
      )

      john_doe = Investor.create!(
        description: "I'm so wealthy...",
        user: investor
      )
      Investor.create!(
        description: "I'm ready to help those that didn't have the correct opportunities"
      )

      puts "Setting up .."
      marx = Talent.create!(
        ito_date: Time.current + 1.week,
        activity_count: 2,
        user: talent2
      )
      elon = Talent.create!(
        ito_date: Time.current - 1.week,
        activity_count: 2,
        user: talent
      )

      puts "Setting up Tokens.."
      marx_token = Token.create!(
        ticker: "MARX",
        price: 2,
        market_cap: 0,
        talent: marx
      )
      elon_token = Token.create!(
        ticker: "ELON",
        price: 1,
        market_cap: 0,
        talent: elon
      )

      puts "Setting up Transactions.."
      service = CreateTransaction.new
      service.call(token: elon_token, amount: 1000, investor: john_doe)
      service.call(token: elon_token, amount: 500, investor: admin_investor)
      service.call(token: marx_token, amount: 350, investor: admin_investor)

      puts "Setting up Career Goals.."
      CareerGoal.create(
        target_date: Date.today + 1.year,
        description: "Successful launch of rocket to plutos orbit.",
        talent: elon
      )
      CareerGoal.create(
        target_date: Date.today + 6.month,
        description: "Launch my book \"The Communist Manifesto\"",
        talent: marx
      )

      puts "Setting up Feeds.."
      Feed.create(user: admin)
      Feed.create(user: investor)
      Feed.create(user: talent)

      Follow.create(user: talent, follower: admin)
      Follow.create(user: talent, follower: investor)

      post = Post.create(user: talent, text: Faker::Lorem.paragraph)
      talent.feed.posts << post
      investor.feed.posts << post
      admin.feed.posts << post

      Comment.create(user: investor, post: post, text: Faker::Marketing.buzzwords)
    end
  end
end
