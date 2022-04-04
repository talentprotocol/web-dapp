class AddRaceIdToUser < ActiveRecord::Migration[6.1]
  def change
    add_reference :users, :races
  end
end
