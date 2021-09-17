class AddProfileToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :profile, :jsonb, default: {}
  end
end
