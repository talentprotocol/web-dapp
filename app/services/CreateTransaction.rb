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

      if token.talent.user_id != user.id && inbound
        if Transaction.find_by(token: token, investor: user.investor)
          create_notification_new_talent_token_bought(token.talent.user, user)
        else
          create_notification_talent_token_bought(token.talent.user, user)
        end
      end

      transaction
    rescue => e
      Rollbar.error(e, "Unable to create transaction, affecting user ##{user_id}")

      raise ActiveRecord::Rollback.new(e)
    end
  end

  private

  def create_notification_new_talent_token_bought(talent_user, user)
    name = user.display_name || user.username
    service = CreateNotification.new
    service.call(
      title: 'Supporter',
      body: "#{name} bought your talent token",
      user_id: talent_user.id,
      type: 'Notifications::TokenAcquired'
    )
  end

  def create_notification_talent_token_bought(talent_user, user)
    name = user.display_name || user.username
    service = CreateNotification.new
    service.call(
      title: 'Supporter',
      body: "#{name} bought more of your talent token",
      user_id: talent_user.id,
      type: 'Notifications::TokenAcquired'
    )
  end
end
