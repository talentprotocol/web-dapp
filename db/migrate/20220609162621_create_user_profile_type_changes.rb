class CreateUserProfileTypeChanges < ActiveRecord::Migration[6.1]
  def change
    create_table :user_profile_type_changes do |t|
      t.integer :user_id
      t.integer :who_dunnit_id
      t.string :previous_profile_type
      t.string :new_profile_type

      t.timestamps
    end

    add_index :user_profile_type_changes, :user_id
    add_index :user_profile_type_changes, :who_dunnit_id
  end
end
