if Rails.env.development?
  namespace :talent do
    task add_more_talent_profiles: :environment do
      puts "Setting up tags.."

      tags = Array.new(10) do |i|
        Tag.create!(description: Faker::Job.field)
      end

      20.times do |index|
        name = Faker::Name.name
        username = name.gsub(/[^a-z0-9]/, "").downcase
        email = Faker::Internet.email

        puts "Creating talent with #{username} - #{email}"

        talent_user = User.create!(
          username: username,
          display_name: name,
          email: email,
          password: "password",
          email_confirmed_at: Time.zone.now
        )

        talent_user.tags << tags.sample

        talent = Talent.create!(
          ito_date: Time.current - 1.week,
          activity_count: index,
          user: talent_user,
          public: true
        )

        Token.create!(
          ticker: username.upcase[0, 5],
          talent: talent
        )

        puts "Setting up Career Goals.."
        CareerGoal.create(
          target_date: Date.today + 1.year,
          description: Faker::Company.catch_phrase,
          talent: talent
        )

        Feed.create(user: talent_user)
        post = Post.create(user: talent_user, text: Faker::Lorem.paragraph)
        talent_user.feed.posts << post
      end
    end
  end
end
