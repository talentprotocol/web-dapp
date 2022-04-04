namespace :races do
  task setup_first_race: :environment do
    race = Race.new
    start_date = Date.new(2022, 4, 4).to_datetime
    race.started_at = start_date
    race.ends_at = start_date + 1.week - 1.second
    race.save!
  end
end
