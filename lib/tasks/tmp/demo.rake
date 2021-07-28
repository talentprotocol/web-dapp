namespace :demo do
  task create: :environment do
    user = User.create!(
      username: "Vitalik Buterin",
      wallet_id: "0x#{SecureRandom.hex(32)}"
    )

    user.create_investor!(
      username: user.username,
      description: Faker::Lorem.paragraph
    )

    talent = user.create_talent!(
      username: user.username,
      description: "Vitalik Buterin is a Russian-Canadian programmer and writer who is best known as one of the co-founders of Ethereum. Buterin became involved with cryptocurrency early in its inception, co-founding Bitcoin Magazine in 2011. In 2014, Buterin launched Ethereum with Gavin Wood.",
      ito_date: Time.current - Random.new.rand(1..19).week,
      activity_count: 0,
      linkedin_url: "https://www.linkedin.com/"
    )

    Tag.create(talent: talent, description: "Entrepreneur", primary: true)
    Tag.create(talent: talent, description: "Developer")
    Tag.create(talent: talent, description: "Blockchain")

    talent.profile_picture = URI.parse("https://qph.fs.quoracdn.net/main-thumb-1465906843-200-hdbguqpsiilgttcxuctvrbalxqbwtfbc.jpeg").open
    talent.save!

    user.talent.create_coin!(
      ticker: "VITA",
      price: 89,
      market_cap: 0 # delete market_cap column
    )
    user.create_feed!

    Transaction.create(coin: user.talent.coin, amount: Random.new.rand(500..1500), investor: Investor.first)

    CareerGoal.create!(
      target_date: Date.today + Random.new.rand(6..24).month,
      description: Faker::Lorem.paragraph(sentence_count: 50),
      talent: user.talent
    )

    Random.new.rand(1..3).times.each do |_i|
      Reward.create!(
        required_amount: Random.new.rand(100..2000),
        description: Faker::Lorem.sentence,
        talent: user.talent
      )
    end
  end
end
