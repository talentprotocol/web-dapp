class Investor < ApplicationRecord
  belongs_to :user, optional: true

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end
end
