module Races
  class ResultsThreeAndFourSql
    def call(race:)
      <<~SQL
        SELECT count(users.id) as overall_result, invited_by.id FROM users
        INNER JOIN invites ON users.invite_id = invites.id
        INNER JOIN users AS invited_by ON invited_by.id = invites.user_id
        WHERE users.race_id = '#{race.id}'
        AND invited_by.role != 'admin'
        AND users.email_confirmed_at IS NOT null
        AND invited_by.id NOT IN (
          SELECT rewards.user_id FROM rewards WHERE rewards.category = 'race' AND rewards.amount = 1200
        )
        GROUP BY invited_by.id
        ORDER BY overall_result DESC
      SQL
    end
  end
end
