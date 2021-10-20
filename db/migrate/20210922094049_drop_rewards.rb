class DropRewards < ActiveRecord::Migration[6.1]
  def change
    drop_table :rewards
  end
end
