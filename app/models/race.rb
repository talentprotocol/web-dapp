class Race < ApplicationRecord
  has_many :users

  def self.active_race
    current_time = Time.current
    find_by("started_at <= ? AND ? < ends_at", current_time, current_time)
  end

  def results
    query = <<~SQL
      SELECT count(users.id) as overall_result, invited_by.id FROM users
      INNER JOIN invites ON users.invite_id = invites.id
      INNER JOIN users AS invited_by ON invited_by.id = invites.user_id
      WHERE users.race_id = '#{id}'
      AND invited_by.role != 'admin'
      AND users.email_confirmed_at IS NOT null
      GROUP BY invited_by.id
      ORDER BY overall_result DESC
    SQL

    ActiveRecord::Base.connection.execute(query)
  end
end
