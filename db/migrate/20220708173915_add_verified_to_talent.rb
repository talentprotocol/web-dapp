class AddVerifiedToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :verified, :boolean, default: false
  end
end
