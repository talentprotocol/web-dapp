class CreateTestimonials < ActiveRecord::Migration[6.1]
  def change
    create_table :testimonials do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.references :user, null: false, foreign_key: true
      t.references :talent, null: false, foreign_key: true

      t.timestamps
    end
  end
end
