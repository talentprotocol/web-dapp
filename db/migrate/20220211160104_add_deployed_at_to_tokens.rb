class AddDeployedAtToTokens < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :deployed_at, :datetime
  end
end
