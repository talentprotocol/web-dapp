class AddFkInvestorsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :investors, :user
  end
end
