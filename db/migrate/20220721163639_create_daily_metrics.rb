class CreateDailyMetrics < ActiveRecord::Migration[6.1]
  def change
    create_table :daily_metrics do |t|
      t.date :date, null: false, unique: true

      t.integer :total_users
      t.integer :total_connected_wallets
      t.integer :total_active_users
      t.integer :total_dead_accounts
      t.integer :total_talent_profiles
      t.integer :total_engaged_users

      t.integer :total_advocates
      t.integer :total_scouts

      # daily metric
      t.integer :talent_applications

      # quests
      t.integer :total_beginner_quests_completed
      t.integer :total_complete_profile_quests_completed
      t.integer :total_ambassador_quests_completed
      t.integer :total_supporter_quests_completed

      # tokens
      t.integer :total_celo_tokens
      t.integer :total_celo_supporters
      t.integer :total_polygon_tokens
      t.integer :total_polygon_supporters

      t.timestamps
    end
  end
end
