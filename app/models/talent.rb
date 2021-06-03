class Talent < ApplicationRecord
  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end
end
