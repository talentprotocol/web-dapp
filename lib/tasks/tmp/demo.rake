namespace :demo do
  task create: :environment do
    user = User.create!(
      username: "Vitalik Buterin",
      wallet_id: "0x#{SecureRandom.hex(32)}"
    )

    user.create_investor!(
      description: Faker::Lorem.paragraph
    )

    talent = user.create_talent!(
      description: "Vitalik Buterin is a Russian-Canadian programmer and writer who is best known as one of the co-founders of Ethereum. Buterin became involved with cryptocurrency early in its inception, co-founding Bittoken Magazine in 2011. In 2014, Buterin launched Ethereum with Gavin Wood.",
      ito_date: Time.current - Random.new.rand(1..19).week,
      activity_count: 0,
    )

    Tag.create(talent: talent, description: "Entrepreneur", primary: true)
    Tag.create(talent: talent, description: "Developer")
    Tag.create(talent: talent, description: "Blockchain")

    talent.profile_picture = URI.parse("https://qph.fs.quoracdn.net/main-thumb-1465906843-200-hdbguqpsiilgttcxuctvrbalxqbwtfbc.jpeg").open
    talent.save!

    user.talent.create_token!(
      ticker: "VITA",
      price: 107,
      market_cap: 0
    )
    user.create_feed!

    service = CreateTransaction.new
    service.call(token: user.talent.token, amount: Random.new.rand(500..1500), investor: Investor.first)

    CareerGoal.create!(
      target_date: Date.today + Random.new.rand(6..24).month,
      description: Faker::Lorem.paragraph(sentence_count: 50),
      talent: user.talent
    )

    user = User.create!(
      username: "João Montenegro",
      wallet_id: "0x#{SecureRandom.hex(32)}"
    )

    user.create_investor!(
      description: "João Montenegro is a Designer, Technologist, and Manager with ten years of experience in helping organizations through human-centered design.\nHis startup ecosystem journey has moved him through company builders and VCs, building his product design studio, mentoring and teaching at university, and eventually co-founding various businesses.\nJoão is an innate collaborator with a drive to continuously inspire others.\nWhen he is not designing 3d printers, vehicles, and digital products & services, João spends his time doing amateur astronomy in inhospitable places, talking about the future with friends, and reading Nat Geo magazine."
    )

    talent = user.create_talent!(
      description: user.investor.description,
      ito_date: Time.current - Random.new.rand(1..19).week,
      activity_count: 0,
    )

    Tag.create(talent: talent, description: "Space", primary: true)
    Tag.create(talent: talent, description: "Technology")
    Tag.create(talent: talent, description: "Design")
    Tag.create(talent: talent, description: "Product")
    Tag.create(talent: talent, description: "Entrepreneur")
    Tag.create(talent: talent, description: "Founder")

    user.talent.create_token!(
      ticker: "SPACE",
      price: 89,
      market_cap: 0
    )
    user.create_feed!

    service = CreateTransaction.new
    service.call(token: user.talent.token, amount: Random.new.rand(500..1500), investor: Investor.first)
    service.call(token: user.talent.token, amount: Random.new.rand(500..1500), investor: Investor.first)
    service.call(token: user.talent.token, amount: Random.new.rand(500..1500), investor: Investor.first)

    CareerGoal.create!(
      target_date: Date.today + Random.new.rand(6..24).month,
      description: "João is looking for support to become the first Portuguese astronaut ever.\n1. Space Studies Program (SSP) in Strasbourg this summer.\n2. Pilot's license.\n3. Start a space business.\n4. Astronaut candidate in 5 years.\n5. Land on the moon in 10 years.",
      talent: user.talent
    )
  end
end
