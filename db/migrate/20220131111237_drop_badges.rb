class DropBadges < ActiveRecord::Migration[6.1]
  def change
    drop_table :badges
  end
end
