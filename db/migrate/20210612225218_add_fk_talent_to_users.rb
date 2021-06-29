class AddFkTalentToUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :talent, :user
  end
end
