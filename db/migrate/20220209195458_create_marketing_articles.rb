class CreateMarketingArticles < ActiveRecord::Migration[6.1]
  def change
    create_table :marketing_articles do |t|
      t.string :link, null: false
      t.string :title, null: false
      t.string :description
      t.text :image_data
      t.date :article_created_at
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
