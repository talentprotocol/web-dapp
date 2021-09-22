class CreateTransaction
  def initialize
  end

  def call(amount:, block_id:, token_address:, transaction_id:, user_id:, inbound:)
    ActiveRecord::Base.transaction do
      token = Token.find_by(contract_id: token_address)
      user = User.find_by(id: user_id)

      transaction = Transaction.create(token_id: token.id, amount: inbound ? amount : -amount, investor: user.investor, block_hash: block_id, transaction_hash: transaction_id, inbound: inbound)

      token.update!(market_cap: token.transactions.sum(:amount) * token.price)

      token.talent.update!(activity_count: token.transactions.count)

      if token.talent.user_id != user.id
        service = CreateFollow.new
        service.call(user_id: token.talent.user_id, follower_id: user.id)
        create_notification_coin_bought(token.talent.user, user)
      end

      transaction
    rescue => e
      Rollbar.error(e, "Unable to create transaction, affecting user ##{user_id}")

      raise ActiveRecord::Rollback.new(e)
    end
  end

  private

  def create_notification_coin_bought(talent_user, user)
    service = CreateNotification.new
    service.call(
      body: "#{user.display_name} bought your coin",
      user_id: talent_user.id,
      type: 'Notifications::TokenAcquired'
    )
  end
end
