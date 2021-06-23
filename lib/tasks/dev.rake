if Rails.env.development?
  namespace :dev do
    task prime: ["db:setup", "db:seed"] do
      puts "Setting up Users.."
      User.create!(
        username: "Admin",
        email: "admin@talentprotocol.com",
        password: "password",
        role: "admin"
      )

      investor = User.create!(
        username: "Investor",
        external_id: "123",
        role: "investor"
      )

      puts "Setting up Investors.."
      Investor.create!(
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
      Talent.create!(
        username: "Karl Marx",
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: "I want to revolutionize the socioeconomic system."
      )
      Talent.create!(
        username: "Elon NotMusk",
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: "I want to take mankind to Pluto!"
      )
    end
  end
end
