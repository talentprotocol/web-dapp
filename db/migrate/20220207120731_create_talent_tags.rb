class CreateTalentTags < ActiveRecord::Migration[6.1]
  def change
    create_table :talent_tags do |t|
      t.references :talent, index: true, foreign_key: true
      t.references :tag, index: true, foreign_key: true

      t.timestamps
    end
  end
end
