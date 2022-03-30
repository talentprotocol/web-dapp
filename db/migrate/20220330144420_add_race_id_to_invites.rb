class AddRaceIdToInvites < ActiveRecord::Migration[6.1]
  def change
    add_reference :invites, :races, foreign_key: true
  end
end
