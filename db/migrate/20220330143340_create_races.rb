class CreateRaces < ActiveRecord::Migration[6.1]
  def change
    create_table :races do |t|
      t.date :started_at
      t.date :ends_at

      t.timestamps
    end
  end
end
