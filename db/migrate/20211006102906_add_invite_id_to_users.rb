class AddInviteIdToUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :users, :invite
  end
end
