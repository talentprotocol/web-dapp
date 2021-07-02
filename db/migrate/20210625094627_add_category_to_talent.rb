class AddCategoryToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :category, :string
    add_index :talent, :category
  end
end
