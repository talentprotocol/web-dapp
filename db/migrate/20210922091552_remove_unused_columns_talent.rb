class RemoveUnusedColumnsTalent < ActiveRecord::Migration[6.1]
  def change
    remove_column :talent, :description
    remove_column :talent, :linkedin_url
    remove_column :talent, :youtube_url
  end
end
