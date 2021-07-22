class CreateFeeds < ActiveRecord::Migration[6.1]
  def change
    create_table :feeds do |t|
      t.timestamps
    end

    add_reference :feeds, :user, foreign_key: true
  end
end
