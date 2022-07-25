class DailyMetricsJob < ApplicationJob
  queue_as :low

  def perform
    DailyMetric.create!(
      date: date,
      total_users: total_users,
      total_connected_wallets: total_connected_wallets,
      total_active_users: total_active_users,
      total_dead_accounts: total_dead_accounts,
      total_talent_profiles: total_talent_profiles,
      talent_applications: talent_applications,
      total_advocates: total_advocates,
      total_scouts: total_scouts,
      total_beginner_quests_completed: total_beginner_quests_completed,
      total_complete_profile_quests_completed: total_complete_profile_quests_completed,
      total_ambassador_quests_completed: total_ambassador_quests_completed,
      total_supporter_quests_completed: total_supporter_quests_completed,
      total_celo_tokens: total_celo_tokens,
      total_celo_supporters: total_celo_supporters,
      total_polygon_tokens: total_polygon_tokens,
      total_polygon_supporters: total_polygon_supporters,
      total_engaged_users: total_engaged_users
    )
  end

  private

  def date
    Date.yesterday
  end

  def total_users
    User.count
  end

  def total_connected_wallets
    User.where.not(wallet_id: nil).count
  end

  def total_active_users
    User.where("users.last_access_at > ?", one_month_ago).count
  end

  def total_dead_accounts
    query = <<~SQL
      SELECT COUNT(*)
      FROM users
      WHERE (
          users.last_access_at > (current_date - interval '60' day)
          AND DATE(users.created_at) = DATE(users.last_access_at)
      ) OR users.last_access_at < (current_date - interval '180' day)
    SQL

    sanitized_sql = ActiveRecord::Base.sanitize_sql_array([query])

    ActiveRecord::Base.connection.execute(sanitized_sql).first["count"]
  end

  def total_talent_profiles
    Talent.count
  end

  def total_engaged_users
    query = <<~SQL
      SELECT COUNT(*)
      FROM users
      WHERE users.id IN (
          select talent.user_id
          from talent
          left join tokens on talent.id = tokens.talent_id
          left join career_goals on talent.id = career_goals.talent_id
          left join perks on talent.id = perks.talent_id
          left join milestones on talent.id = milestones.talent_id
          left join goals on career_goals.id = goals.career_goal_id
          where talent.updated_at > :one_month_ago
          OR tokens.updated_at > :one_month_ago
          OR career_goals.updated_at > :one_month_ago
          OR perks.updated_at > :one_month_ago
          OR perks.created_at > :one_month_ago
          OR milestones.updated_at > :one_month_ago
          OR milestones.created_at > :one_month_ago
          OR goals.updated_at > :one_month_ago
          OR goals.created_at > :one_month_ago
      )
      OR users.id IN (
          select investors.user_id
          from investors
          where investors.updated_at > :one_month_ago
      )
      OR users.wallet_id IN (
          select talent_supporters.supporter_wallet_id
          from talent_supporters
          where talent_supporters.last_time_bought_at > :one_month_ago
      )
      OR users.id IN (
          select messages.sender_id
          from messages
          where messages.created_at > :one_month_ago
      )
      OR users.id IN (
          select follows.follower_id
          from follows
          where follows.created_at > :one_month_ago
      )
    SQL

    sanitized_sql = ActiveRecord::Base.sanitize_sql_array([query, one_month_ago: one_month_ago])

    ActiveRecord::Base.connection.execute(sanitized_sql).first["count"]
  end

  def talent_applications
    query = <<~SQL
      SELECT COUNT(DISTINCT(user_id))
      FROM user_profile_type_changes
      where new_profile_type = 'waiting_for_approval'
      AND created_at::date = :date
    SQL

    sanitized_sql = ActiveRecord::Base.sanitize_sql_array([query, date: date])

    ActiveRecord::Base.connection.execute(sanitized_sql).first["count"]
  end

  def total_advocates
    query = <<~SQL
      SELECT COUNT(DISTINCT user_id)
      FROM invites
      where id IN (
          SELECT invite_id
          FROM users
          WHERE tokens_purchased = true
      )
    SQL

    sanitized_sql = ActiveRecord::Base.sanitize_sql_array([query, date: date])

    ActiveRecord::Base.connection.execute(sanitized_sql).first["count"]
  end

  def total_scouts
    query = <<~SQL
      SELECT COUNT(DISTINCT user_id)
      FROM invites
      where id IN (
          SELECT invite_id
          FROM users
          INNER JOIN talent on users.id = talent.user_id
          INNER JOIN tokens on talent.id = tokens.talent_id
          WHERE tokens.contract_id IS NOT NULL
      )
    SQL

    sanitized_sql = ActiveRecord::Base.sanitize_sql_array([query, date: date])

    ActiveRecord::Base.connection.execute(sanitized_sql).first["count"]
  end

  def total_beginner_quests_completed
    Quest.where(type: "Quests::User", status: "done").count
  end

  def total_complete_profile_quests_completed
    Quest.where(type: "Quests::TalentProfile", status: "done").count
  end

  def total_ambassador_quests_completed
    Quest.where(type: "Quests::Ambassador", status: "done").count
  end

  def total_supporter_quests_completed
    Quest.where(type: "Quests::Supporter", status: "done").count
  end

  def total_celo_tokens
    Token.where(deployed: true).count
  end

  def total_celo_supporters
    User.where(tokens_purchased: true).count
  end

  def total_polygon_tokens
    0
  end

  def total_polygon_supporters
    0
  end

  def one_month_ago
    @one_month_ago ||= 31.days.ago.beginning_of_day
  end
end
