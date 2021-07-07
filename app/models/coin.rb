class Coin < ApplicationRecord
  belongs_to :talent
  has_many :transactions

  def display_ticker
    "$#{ticker}"
  end

  def display_price
    "$#{(price.to_f / 100).to_s(:delimited)}"
  end

  def display_market_cap
    "$#{(market_cap.to_f / 100).to_s(:delimited)}"
  end
end
