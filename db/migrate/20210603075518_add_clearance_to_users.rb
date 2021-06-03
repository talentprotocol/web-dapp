class AddClearanceToUsers < ActiveRecord::Migration[6.1]
  def self.up
    change_table :users do |t|
      t.string :confirmation_token, limit: 128
    end


    users = select_all("SELECT id FROM users WHERE remember_token IS NULL")

    users.each do |user|
      update <<-SQL.squish
        UPDATE users
        SET remember_token = '#{Clearance::Token.new}'
        WHERE id = '#{user['id']}'
      SQL
    end
  end

  def self.down
    change_table :users do |t|
      t.remove :confirmation_token
    end
  end
end
