class CreateRaces < ActiveRecord::Migration[6.1]
  def change
    create_table :races do |t|
      t.datetime :started_at
      t.datetime :ends_at

      t.timestamps
    end
  end
end
