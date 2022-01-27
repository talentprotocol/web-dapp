class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications do |t|
      t.text :body, null: false, default: ""
      t.references :user, index: true
      t.references :source, index: true
      t.string :type, null: false, default: ""
      t.boolean :read, default: false

      t.timestamps
    end
  end
end
