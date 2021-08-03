module Web3
  class Auth
    MESSAGE = "We use signatures to authenticate you. Sign this to give us proof that you have access to the address you want to use: ".freeze

    def initialize
    end

    def verify_wallet(user:, signature:)
      wallet_id = user.wallet_id

      decoded_wallet = eth_sig.getSignerAccount(MESSAGE + user.nounce, signature)

      wallet_id.downcase == decoded_wallet.downcase
    end

    private

    def eth_sig
      @eth_sig ||= EthSigSchmooze.new(__dir__)
    end
  end
end
