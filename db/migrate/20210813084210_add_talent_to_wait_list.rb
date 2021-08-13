class AddTalentToWaitList < ActiveRecord::Migration[6.1]
  def change
    add_column :wait_list, :talent, :boolean, default: false
  end
end
