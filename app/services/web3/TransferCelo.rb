module Web3
  class TransferCelo
    DEFAULT_AMOUNT = 0.1

    def initialize
    end

    def call(user_id:)
      user = User.find(user_id)

      if user.wallet_id
        transfer_to_wallet(DEFAULT_AMOUNT, user.wallet_id)
      end
    end

    private

    def transfer_to_wallet(amount, address)
      true
    end
  end
end
