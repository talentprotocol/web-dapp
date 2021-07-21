class CreateFeedPosts < ActiveRecord::Migration[6.1]
  def change
    create_table :feed_posts do |t|
      t.timestamps
    end

    add_reference :feed_posts, :feed, foreign_key: true
    add_reference :feed_posts, :post, foreign_key: true
    add_index :feed_posts, [:feed_id, :post_id], unique: true
  end
end
