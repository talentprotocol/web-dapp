class AddNotionPageIdToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :notion_page_id, :string
  end
end
