class AddRaceIdToUser < ActiveRecord::Migration[6.1]
  def change
    add_reference :users, :race
  end
end
