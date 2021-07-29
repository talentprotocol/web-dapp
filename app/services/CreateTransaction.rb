class CreateTransaction
  def initialize
  end

  def call(coin:, amount:, investor:)
    ActiveRecord::Base.transaction do
      transaction = Transaction.create(coin_id: coin.id, amount: amount, investor: investor)

      coin.update!(market_cap: coin.transactions.sum(:amount) * coin.price)

      coin.talent.update!(activity_count: coin.transactions.count)

      transaction
    rescue
      false
    end
  end
end
