class Investor < ApplicationRecord
  belongs_to :user, optional: true
  has_many :transactions

  delegate :wallet_id, to: :user

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end
end
