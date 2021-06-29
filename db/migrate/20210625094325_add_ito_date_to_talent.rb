class AddItoDateToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :ito_date, :datetime
    add_index :talent, :ito_date
  end
end
