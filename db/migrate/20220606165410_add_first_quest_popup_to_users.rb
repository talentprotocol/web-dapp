class AddFirstQuestPopupToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :first_quest_popup, :boolean, null: false, default: false
  end
end
