class AddUserNFTTxInfoToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :user_nft_token_id, :integer
    add_column :users, :user_nft_tx, :string
  end
end
