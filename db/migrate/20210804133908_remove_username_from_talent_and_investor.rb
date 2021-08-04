class RemoveUsernameFromTalentAndInvestor < ActiveRecord::Migration[6.1]
  def change
    remove_column :investors, :username
    remove_column :talent, :username
  end
end
