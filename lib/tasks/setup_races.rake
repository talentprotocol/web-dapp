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
  end
end
