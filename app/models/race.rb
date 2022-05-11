class Race < ApplicationRecord
  has_many :users

  def self.active_race
    current_time = Time.current
    find_by("started_at <= ? AND ? < ends_at", current_time, current_time)
  end

  def results
    # First four races had different ways of calculating results
    # We now only want to include users that have purchased tokens
    query = if id <= 4
      Races::ResultsWithWalletConnected.new.call(race: self)
    else
      <<~SQL
        SELECT count(users.id) as overall_result, invited_by.id FROM users
        INNER JOIN invites ON users.invite_id = invites.id
        INNER JOIN users AS invited_by ON invited_by.id = invites.user_id
        INNER JOIN quests ON quests.user_id = users.id
        WHERE users.race_id = '#{id}'
        AND invited_by.role != 'admin'
        AND users.email_confirmed_at IS NOT null
        AND users.wallet_id IS NOT null
        AND users.tokens_purchased IS TRUE
        AND invited_by.id NOT IN (
          SELECT rewards.user_id FROM rewards WHERE rewards.category = 'race' AND rewards.amount = 1200
        )
        AND quests.type = 'Quests::User' AND quests.status = 'done'
        GROUP BY invited_by.id
        ORDER BY overall_result DESC
      SQL
    end

    ActiveRecord::Base.connection.execute(query)
  end
end
