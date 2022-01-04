class AddThemePreferenceToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :theme_preference, :string, default: "light"
  end
end
