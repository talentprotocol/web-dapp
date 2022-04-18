class FinishActiveRace
  def initialize
    # Get the second last race (the last race is already ongoing)
    @race = Race.order(id: :desc).second
  end

  def call
    create_next
    reward_winners
  end

  private

  # Create the race for the week after the current
  def create_next
    last_race = Race.last
    race = Race.new
    start_date = (last_race.ends_at + 1.day).beginning_of_day
    race.started_at = start_date.beginning_of_day
    race.ends_at = start_date + 1.week - 1.second
    race.save!
  end

  # Reward the winners of the race that just finished
  def reward_winners
    winners = @race.results.to_a

    ActiveRecord::Base.transaction do
      if winners[0].present?
        first_winner = User.find_by(id: winners[0]["id"])
        Reward.create!(user: first_winner, amount: 1200, category: "race")
      end
      if winners[1].present?
        second_winner = User.find_by(id: winners[1]["id"])
        Reward.create!(user: second_winner, amount: 500, category: "race")
      end
      if winners[2].present?
        third_winner = User.find_by(id: winners[2]["id"])
        Reward.create!(user: third_winner, amount: 300, category: "race")
      end
    end
  end
end
