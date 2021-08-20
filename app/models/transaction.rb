class Transaction < ApplicationRecord
  belongs_to :investor
  belongs_to :token

  def value
    amount.abs * token.price
  end

  def display_value
    "$#{(value.to_f / 100).to_s(:delimited)}"
  end

  def value_in_tal
    amount.abs * token.price_in_tal
  end

  def display_value_in_tal
    "#{value_in_tal.to_f.round(0).to_s(:delimited)} ✦"
  end

  def to_json_view
    {
      id: id,
      tokenTicker: token.display_ticker,
      talentName: token.talent.username,
      amount: amount.abs,
      transactionId: transaction_hash,
      price: token.display_price,
      priceInTal: token.display_price_in_tal,
      value: display_value,
      valueInTal: display_value_in_tal,
      priceVariance7d: "0",
      profilePictureUrl: token.talent.profile_picture_url,
      inbound: inbound
    }
  end
end
