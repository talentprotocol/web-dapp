class AddLinkedUrlToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :linkedin_url, :string
  end
end
