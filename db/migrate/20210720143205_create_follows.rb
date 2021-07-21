class CreateFollows < ActiveRecord::Migration[6.1]
  def change
    create_table :follows do |t|
      t.timestamps
    end

    add_reference :follows, :user, foreign_key: true
    add_reference :follows, :follower, foreign_key: {to_table: :users}
    add_index :follows, [:user_id, :follower_id], unique: true
  end
end
