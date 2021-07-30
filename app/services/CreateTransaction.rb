class CreateTransaction
  def initialize
  end

  def call(coin:, amount:, investor:)
    ActiveRecord::Base.transaction do
      transaction = Transaction.create(coin_id: coin.id, amount: amount, investor: investor)

      coin.update!(market_cap: coin.transactions.sum(:amount) * coin.price)

      coin.talent.update!(activity_count: coin.transactions.count)

      service = CreateFollow.new
      service.call(user_id: coin.talent.user_id, follower_id: investor.user_id)

      transaction
    rescue
      false
    end
  end
end
