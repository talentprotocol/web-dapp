class DropServices < ActiveRecord::Migration[6.1]
  def change
    drop_table :services
  end
end
