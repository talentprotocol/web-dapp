class CreatePartnerships < ActiveRecord::Migration[6.1]
  def change
    create_table :partnerships do |t|
      t.string :name, null: false
      t.text :logo_data
      t.string :website_url
      t.string :twitter_url
      t.references :invite, foreign_key: true

      t.timestamps
    end
  end
end
