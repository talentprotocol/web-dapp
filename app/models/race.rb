class Race < ApplicationRecord
  has_many :users

  def self.active_race
    current_time = Time.current
    find_by("started_at <= ? AND ? < ends_at", current_time, current_time)
  end

  def old_results
    query = <<~SQL
      SELECT count(users.id) as overall_result, invited_by.id FROM users
      INNER JOIN invites ON users.invite_id = invites.id
      INNER JOIN users AS invited_by ON invited_by.id = invites.user_id
      LEFT OUTER JOIN rewards on rewards.user_id = invited_by.id
      WHERE users.race_id = '#{id}'
      AND invited_by.role != 'admin'
      AND users.email_confirmed_at IS NOT null
      GROUP BY invited_by.id
      ORDER BY overall_result DESC
    SQL

    ActiveRecord::Base.connection.execute(query)
  end

  def results
    # First two races had different ways of calculating results
    # We now only want to include users that have wallets connected
    query = if id <= 2
      <<~SQL
        SELECT count(users.id) as overall_result, invited_by.id FROM users
        INNER JOIN invites ON users.invite_id = invites.id
        INNER JOIN users AS invited_by ON invited_by.id = invites.user_id
        WHERE users.race_id = '#{id}'
        AND invited_by.role != 'admin'
        AND users.email_confirmed_at IS NOT null
        AND invited_by.id NOT IN (
          SELECT rewards.user_id FROM rewards WHERE rewards.category = 'race' AND rewards.amount = 1200
        )
        GROUP BY invited_by.id
        ORDER BY overall_result DESC
      SQL
    else
      <<~SQL
        SELECT count(users.id) as overall_result, invited_by.id FROM users
        INNER JOIN invites ON users.invite_id = invites.id
        INNER JOIN users AS invited_by ON invited_by.id = invites.user_id
        WHERE users.race_id = '#{id}'
        AND invited_by.role != 'admin'
        AND users.email_confirmed_at IS NOT null
        AND users.wallet_id IS NOT null
        AND invited_by.id NOT IN (
          SELECT rewards.user_id FROM rewards WHERE rewards.category = 'race' AND rewards.amount = 1200
        )
        GROUP BY invited_by.id
        ORDER BY overall_result DESC
      SQL
    end

    ActiveRecord::Base.connection.execute(query)
  end
end
