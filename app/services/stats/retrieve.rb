class Stats::Retrieve
  def initialize(number_of_weeks)
    @number_of_weeks = number_of_weeks
  end

  def call
    prev_supporters = 0
    prev_talent = 0
    prev_tokens = 0
    prev_live_talent = 0
    start_date = Time.new(2021, 11, 1).beginning_of_day

    @number_of_weeks.times do |i|
      users = User.where("created_at < ?", start_date)
      talent = Talent.where("created_at < ?", start_date)
      supporters = users.count - talent.count
      tokens = Token.where.not(contract_id: nil).where("updated_at < ?", start_date)
      live_talent = Talent.joins(:token).where(public: true).where("token.updated_at < ?", start_date).where.not(token: {contract_id: nil})

      puts "WEEK #{i} - #{start_date}"
      puts "Supporters: #{supporters - prev_supporters}"
      puts "Registered Talent: #{talent.count - prev_talent}"
      puts "Token Launched: #{tokens.count - prev_tokens}"
      puts "LIVE TALENT Launched: #{live_talent.count - prev_live_talent}"

      start_date += 1.week
      prev_supporters = supporters
      prev_talent = talent.count
      prev_tokens = tokens.count
      prev_live_talent = live_talent.count

      puts "------------------------------------------"
    end
  end

  def race
    players = ["pcbo", "pedro", "fred", "gustavo", "andreas", "francisco", "ivan", "filipe", "sam"]

    players.each do |player|
      invite = Invite.find_by(code: player)
      first_race_end = Time.new(2021, 12, 24).end_of_day

      users_since_first_race = User.where(invite_id: invite.id).where("created_at > ?", first_race_end)

      puts "#{player} has invited #{users_since_first_race.count} talent"
    end
  end
end
