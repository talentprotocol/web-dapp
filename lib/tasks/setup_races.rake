namespace :races do
  task setup_first_race: :environment do
    race = Race.new
    start_date = Date.new(2022, 4, 4).to_datetime
    race.started_at = start_date
    race.ends_at = start_date + 1.week - 1.second
    race.save!

    # Add race id 1 to all users created since race start
    users = User.where("created_at >= ?", race.started_at)
    users.update_all(race_id: race.id)

    next_race = Race.new
    next_start_date = (race.ends_at + 1.day).beginning_of_day
    next_race.started_at = next_start_date.beginning_of_day
    next_race.ends_at = next_start_date + 1.week - 1.second
    next_race.save!

    User.where(tokens_purchased: true).find_each do |user|
      user.invites.where(talent_invite: false).update_all(max_uses: nil)
    end
  end
end
