if Rails.env.development?
  namespace :dev do
    task prime: ["db:setup", "db:seed"] do
      puts "Setting up Alert configurations.."
      AlertConfiguration.create!(
        page: "/talent",
        alert_type: "primary",
        text: "Connect your wallet to buy Carrer Coins",
        href: "https://metamask.io/",
        button_text: "Connect MetaMask",
        css_class: "w-100"
      )

      puts "Setting up Users.."
      User.create!(
        username: "Admin",
        email: "admin@talentprotocol.com",
        password: "password",
        role: "admin"
      )

      investor = User.create!(
        username: "Investor",
        external_id: "123"
      )

      puts "Setting up Investors.."
      john_doe = Investor.create!(
        username: "John Doe",
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: "I'm so wealthy...",
        user: investor
      )
      Investor.create!(
        username: "James Marco",
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: "I'm ready to help those that didn't have the correct opportunities"
      )

      puts "Setting up Talents.."
      marx = Talent.create!(
        username: "Karl Marx",
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: "I want to revolutionize the socioeconomic system.",
        ito_date: Time.current + 1.week,
        linkedin_url: "https://www.linkedin.com/"
      )
      elon = Talent.create!(
        username: "Elon NotMusk",
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: "I want to take mankind to Pluto!",
        ito_date: Time.current - 1.week,
        activity_count: 1,
        linkedin_url: "https://www.linkedin.com/"
      )

      puts "Setting up Coins.."
      Coin.create!(
        ticker: "MARX",
        price: 2,
        market_cap: 3_000_000_00,
        talent: marx
      )
      elon_coin = Coin.create!(
        ticker: "ELON",
        price: 1,
        market_cap: 1_000_000_00,
        talent: elon
      )

      puts "Setting up Transactions.."
      Transaction.create(
        coin: elon_coin,
        investor: john_doe,
        amount: 1000
      )

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

      puts "Setting up Rewards.."
      Reward.create(
        required_amount: 1_000,
        description: "You get a monthly update on progress",
        talent: elon
      )
      Reward.create(
        required_amount: 100_000_000,
        description: "You get a ticket for the first trip",
        talent: elon
      )
      Reward.create(
        required_amount: 5_000,
        description: "You get a copy of my book on launch",
        talent: marx
      )
    end
  end
end
