class Transaction < ApplicationRecord
  belongs_to :investor
  belongs_to :coin

  def value
    amount * coin.price
  end

  def display_value
    "$#{(value.to_f / 100).to_s(:delimited)}"
  end

  def value_in_tal
    amount * coin.price_in_tal
  end

  def display_value_in_tal
    "#{value_in_tal.to_f.round(0).to_s(:delimited)} ✦"
  end

  def to_json_view
    prng = Random.new

    {
      id: id,
      coinTicker: coin.display_ticker,
      talentName: coin.talent.username,
      amount: amount,
      transactionId: transaction_hash,
      price: coin.display_price,
      priceInTal: coin.display_price_in_tal,
      value: display_value,
      valueInTal: display_value_in_tal,
      priceVariance7d: prng.rand(1...13.5).truncate(2).to_s,
      profilePictureUrl: coin.talent.profile_picture_url,
      inbound: inbound
    }
  end
end
