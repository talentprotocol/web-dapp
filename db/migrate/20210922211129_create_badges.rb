class CreateBadges < ActiveRecord::Migration[6.1]
  def change
    create_table :badges do |t|
      t.string :name, null: false, default: ''
      t.text :image_data
      t.string :url
      t.string :alt

      t.timestamps
    end
  end
end
