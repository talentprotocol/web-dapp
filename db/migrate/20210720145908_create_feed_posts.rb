class CreateFeedPosts < ActiveRecord::Migration[6.1]
  def change
    create_table :feed_posts do |t|

      t.timestamps
    end
  end
end
