class Token < ApplicationRecord
  belongs_to :talent
  validates :ticker, length: {in: 3..8}, if: :ticker_exists?

  TAL_VALUE = 2

  CHAIN_INFO = {
    "137": "POLYGON (Matic)",
    "42220": "CELO",
    "44787": "CELO (Alfajores)",
    "80001": "POLYGON (Mumbai)"
  }

  def display_ticker
    "$#{ticker}"
  end

  def chain_name
    CHAIN_INFO[chain_id]
  end

  private

  def ticker_exists?
    ticker.present?
  end
end
