class AddMemberNFTToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :member_nft_address, :string
    add_column :users, :member_nft_minted, :boolean, default: false
    add_column :users, :member_nft_token_id, :integer
    add_column :users, :member_nft_tx, :string
  end
end
