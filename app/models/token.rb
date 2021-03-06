class Token < ApplicationRecord
  belongs_to :talent
  validates :ticker, length: {in: 3..8}, if: :ticker_exists?

  TAL_VALUE = 2
  TAL_DECIMALS = 10**18
  TAL_VALUE_IN_USD = 0.02

  def display_ticker
    "$#{ticker}"
  end

  private

  def ticker_exists?
    ticker.present?
  end
end
