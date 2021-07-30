class AddRequiredTextToRewards < ActiveRecord::Migration[6.1]
  def change
    add_column :rewards, :required_text, :string
  end
end
