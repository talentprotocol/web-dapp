class AddIndexesToImpersonations < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :impersonations, :users, column: :impersonator_id, if_not_exists: true
    add_foreign_key :impersonations, :users, column: :impersonated_id, if_not_exists: true
  end
end
