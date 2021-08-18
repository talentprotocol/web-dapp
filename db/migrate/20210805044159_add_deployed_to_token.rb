class AddDeployedToToken < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :deployed, :boolean, default: false
  end
end
