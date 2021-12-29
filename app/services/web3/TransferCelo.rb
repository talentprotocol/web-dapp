module Web3
  class TransferCelo
    # 0.1 CELO
    DEFAULT_AMOUNT = 10000000000000000

    def call(user:)
      if user.wallet_id && no_previous_transfer(user) && key
        tx_hash = client.transfer(key, user.wallet_id, DEFAULT_AMOUNT)

        transfer = Transfer.new
        transfer.user = user
        transfer.amount = DEFAULT_AMOUNT
        transfer.tx_hash = tx_hash
        transfer.save!
      end
    end

    private

    def no_previous_transfer(user)
      !Transfer.where(user: user).exists?
    end

    def client
      @client ||= Ethereum::HttpClient.new(celo_url)
    end

    def key
      @key ||=
        if ENV["CELO_WALLET_PRIVATE_KEY"]
          Eth::Key.new(priv: ENV["CELO_WALLET_PRIVATE_KEY"])
        else
          false
        end
    end

    def celo_url
      ENV["FORNO_URL"] || "https://alfajores-forno.celo-testnet.org"
    end
  end
end
