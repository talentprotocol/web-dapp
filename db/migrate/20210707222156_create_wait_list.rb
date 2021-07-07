class CreateWaitList < ActiveRecord::Migration[6.1]
  def change
    create_table :wait_list do |t|
      t.boolean :approved, default: false
      t.string :email, null: false

      t.timestamps
    end

    add_index :wait_list, :approved
    add_index :wait_list, :email, unique: true
  end
end
