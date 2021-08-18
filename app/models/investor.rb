class Investor < ApplicationRecord
  belongs_to :user, optional: true
  has_many :transactions

  delegate :wallet_id, :username, to: :user

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end

  def total_invested
    transactions.sum(:amount)
  end

  def tokens_held
    token_ids = transactions.pluck(:token_id)

    Token.where(id: token_ids)
  end
end
