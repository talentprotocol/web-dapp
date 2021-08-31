class Token < ApplicationRecord
  belongs_to :talent
  has_many :transactions

  validates :ticker, length: {in: 3..8}

  TAL_VALUE = 2

  def display_ticker
    "$#{ticker}"
  end

  def display_price
    "$#{(price.to_f / 100).to_s(:delimited)}"
  end

  def display_market_cap
    "$#{current_market_cap.truncate(3).to_s(:delimited)}"
  end

  def current_market_cap
    (price.to_f / 100) * transactions.sum(:amount)
  end

  def market_cap_at(date)
    (price.to_f / 100) * transactions.where("created_at < ?", date).sum(:amount)
  end

  def variance(date)
    if transactions.empty?
      return 0
    end

    current = current_market_cap
    old = market_cap_at(date)

    old = 1 if old == 0

    variance = current / old * 100

    if current > old
      variance
    else
      variance - 100
    end
  end

  def variance7d
    variance(Time.current - 7.days)
  end

  def variance30d
    variance(Time.current - 30.days)
  end

  def price_in_tal
    @price_in_tal ||=
      begin
        in_tal = (price * 1.0) / TAL_VALUE
        if in_tal > 1000
          return in_tal.truncate(3)
        else
          counter = 0
          truncate_index = 1
          in_tal.to_s.each_char do |c|
            truncate_index += 1

            if c != "0" || c != "."
              counter += 1
            end
            break if counter > 2
          end

          in_tal.truncate(truncate_index)
        end
      end
  end

  def display_price_in_tal
    "#{(price_in_tal.round(2)).to_s(:delimited)} ✦"
  end

  def value_in_tal(user)
    transactions.where(investor: user.investor).sum(&:amount) * price_in_tal
  end

  def display_value_in_tal(user)
    "#{value_in_tal(user).to_f.round(0).to_s(:delimited)} ✦"
  end

  def display_value(user)
    "$#{(transactions.where(investor: user.investor).sum(&:amount).to_f * TAL_VALUE / 100).to_s(:delimited)}"
  end
end
