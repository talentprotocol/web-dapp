class CreateLikes < ActiveRecord::Migration[6.1]
  def change
    create_table :likes do |t|
      t.timestamps
    end

    add_reference :likes, :user, foreign_key: true
    add_reference :likes, :post, foreign_key: true
    add_index :likes, [:user_id, :post_id], unique: true
  end
end
