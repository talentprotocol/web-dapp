class CreateTags < ActiveRecord::Migration[6.1]
  def change
    create_table :tags do |t|
      t.string :description
      t.boolean :primary

      t.timestamps
    end

    add_reference :tags, :talent, foreign_key: true
  end
end
