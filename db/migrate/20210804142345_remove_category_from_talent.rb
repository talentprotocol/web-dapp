class RemoveCategoryFromTalent < ActiveRecord::Migration[6.1]
  def change
    remove_index :talent, :category
    remove_column :talent, :category
  end
end
