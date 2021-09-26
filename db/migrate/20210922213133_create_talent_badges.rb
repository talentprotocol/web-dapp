class CreateTalentBadges < ActiveRecord::Migration[6.1]
  def change
    create_table :talent_badges do |t|
      t.references :talent, null: false, foreign_key: true
      t.references :badge, null: false, foreign_key: true

      t.timestamps
    end
  end
end
