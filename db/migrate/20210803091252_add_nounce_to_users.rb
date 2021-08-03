class AddNounceToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :nounce, :string
  end
end
