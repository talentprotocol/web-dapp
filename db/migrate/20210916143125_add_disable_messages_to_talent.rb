class AddDisableMessagesToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :disable_messages, :boolean, default: false
  end
end
