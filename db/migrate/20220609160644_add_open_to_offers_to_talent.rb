class AddOpenToOffersToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :open_to_job_offers, :boolean
  end
end
