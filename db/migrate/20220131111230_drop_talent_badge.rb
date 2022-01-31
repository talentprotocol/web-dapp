class DropTalentBadge < ActiveRecord::Migration[6.1]
  def change
    drop_table :talent_badges
  end
end
