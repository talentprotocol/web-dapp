class AddUserNFTToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :user_nft_address, :string
    add_column :users, :user_nft_minted, :boolean, default: false
  end
end
