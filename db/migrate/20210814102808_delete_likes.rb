class DeleteLikes < ActiveRecord::Migration[6.1]
  def change
    remove_index :likes, [:user_id, :post_id]
    drop_table :likes
  end
end
