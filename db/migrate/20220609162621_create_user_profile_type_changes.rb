class CreateUserProfileTypeChanges < ActiveRecord::Migration[6.1]
  def change
    create_table :user_profile_type_changes do |t|
      t.references :user, null: false, foreign_key: {to_table: :users}, index: true
      t.references :who_dunnit, null: false, foreign_key: {to_table: :users}, index: true
      t.string :previous_profile_type
      t.string :new_profile_type

      t.timestamps
    end
  end
end
