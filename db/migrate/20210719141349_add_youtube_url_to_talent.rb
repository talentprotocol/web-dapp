class AddYoutubeUrlToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :youtube_url, :string
  end
end
