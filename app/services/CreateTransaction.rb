class CreateTransaction
  def initialize
  end

  def call(amount:, block_id:, token_address:, transaction_id:, user_id:, inbound:)
    ActiveRecord::Base.transaction do
      coin = Coin.find_by(contract_id: token_address)
      user = User.find_by(id: user_id)

      transaction = Transaction.create(
        coin_id: coin.id,
        amount: amount,
        investor: user.investor,
        block_hash: block_id,
        transaction_hash: transaction_id,
        inbound: inbound
      )

      coin.update!(market_cap: coin.transactions.sum(:amount) * coin.price)

      coin.talent.update!(activity_count: coin.transactions.count)

      service = CreateFollow.new
      service.call(user_id: coin.talent.user_id, follower_id: user.id)

      transaction
    rescue
      false
    end
  end
end
