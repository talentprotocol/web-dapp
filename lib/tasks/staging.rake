namespace :staging do
  task prime: ["db:seed"] do
    puts "Setting up Alert configurations.."

    AlertConfiguration.create!(
      page: "/feed",
      alert_type: "primary",
      text: "Apply to launch your Career Coin on Talent Protocol",
      href: "https://www.talentprotocol.com/invite",
      button_text: "Reserve $TICKER"
    )

    puts "Setting up Users.."
    admins = [
      {name: "andreas", ticker: "AVIL", description: "Developed the World Record Game “Kill The Duck”. Serial tech entrepreneur with +30M software users worldwide. Founder of SHARKCODERS, the 1st network of tech schools in Portugal, teaching coding skills, creating games, apps, robotics for Kids & Teens.", linkedin: "andreasvilela"},
      {name: "filipe", ticker: "FILM", description: "A computer engineer by training and a creative strategist by nature. 10+ years of marketing experience building progressive brands and engaging communities for Nike, Nestlé, L’Oréal and ActivoBank - Europe's Best Bank in Social Media in 2012.", linkedin: "filipermacedo"},
      {name: "pedro", ticker: "PCBO", description: "HR Tech innovator whose career mission is to build products that allow individuals to fully own their careers. Founder at Landing.Jobs - the biggest tech recruitment marketplace in Portugal. Selected by HR Weekly as a top 100 HR Tech expert.", linkedin: "pcboliveira"},
      {name: "francisco", ticker: "LEAL", description: "Full-stack developer with 4+ years of experience and a background on electrical and computer engineering that specialises in modern javascript and ruby. From solo developer to core member of a 65+ development team with a special interested in sharing knowledge and help people reach their potential.", linkedin: "lealfrancisco"}
    ]

    admins.each do |admin|
      user = User.create!(
        username: admin[:name].capitalize,
        email: "#{admin[:name]}@talentprotocol.com",
        password: SecureRandom.base64(12),
        role: "admin"
      )
      user.create_investor!(
        username: admin[:name].capitalize,
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: admin[:description]
      )
      talent = user.create_talent!(
        username: admin[:name].capitalize,
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: admin[:description],
        ito_date: Time.current - Random.new.rand(1..19).week,
        activity_count: 0,
        linkedin_url: "https://www.linkedin.com/in/#{admin[:linkedin]}/"
      )
      talent.profile_picture = URI.parse(Faker::Avatar.image).open
      talent.save!
      user.talent.create_coin!(
        ticker: admin[:ticker],
        price: Random.new.rand(1..500),
        market_cap: Random.new.rand(250_000..750_000)
      )
      user.create_feed!
    end

    6.times.each do |i|
      user = User.create!(
        username: Faker::Name.name,
        external_id: "talent-#{i}"
      )
      talent = user.create_talent!(
        username: user.username,
        wallet_id: "0x#{SecureRandom.hex(32)}",
        description: Faker::Lorem.paragraph,
        ito_date: Time.current - Random.new.rand(-19..19).week,
        activity_count: 0,
        linkedin_url: "https://www.linkedin.com/"
      )
      talent.profile_picture = URI.parse(Faker::Avatar.image).open
      talent.save!

      user.talent.create_coin!(
        ticker: Faker::Name.initials(number: 4),
        price: Random.new.rand(1..500),
        market_cap: Random.new.rand(250_000..750_000)
      )
      user.create_feed!

      CareerGoal.create!(
        target_date: Date.today + Random.new.rand(6..24).month,
        description: Faker::Company.bs,
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

    puts "Setting up follows.."
    User.all.find_each do |user|
      User.where.not(id: user.id).find_each do |other_user|
        unless Follow.where(user: user, follower: other_user).exists?
          Follow.create(user: user, follower: other_user)
        end
        unless Follow.where(user: other_user, follower: user).exists?
          Follow.create(user: other_user, follower: user)
        end
      end
    end

    puts "Setting up some posts.."
    User.where(role: nil).find_each do |user|
      Random.new.rand(1..3).times.each do |_i|
        service = CreatePost.new
        service.call(text: Faker::Lorem.paragraph, writer: user)
      end
    end

    puts "Setting up some comments & likes.."
    Post.all.find_each do |post|
      Random.new.rand(1..3).times.each do |_i|
        user = User.find(Random.new.rand(1..User.last.id))
        Comment.create!(user: user, post: post, text: Faker::Marketing.buzzwords)
      end

      Random.new.rand(1..6).times.each do |_i|
        user = User.find(Random.new.rand(1..User.last.id))

        unless Like.where(user: user, post: post).exists?
          Like.create!(user: user, post: post)
        end
      end
    end
  end
end
