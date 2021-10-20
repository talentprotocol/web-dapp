class CreateInvites < ActiveRecord::Migration[6.1]
  def change
    create_table :invites do |t|
      t.string :code, null: false
      t.integer :uses, default: 0
      t.integer :max_uses, default: 2
      t.boolean :talent_invite, default: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
