class AddEndedAtToImpersonations < ActiveRecord::Migration[6.1]
  def change
    add_column :impersonations, :ended_at, :datetime
  end
end
