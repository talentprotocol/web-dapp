module Web3
  class MintUserNFT
    def initialize(params = {})
      @season_number = params.fetch(:season, 2)
    end

    def call(user:)
      if user.wallet_id
        if contract.call.balance_of(user.wallet_id) == 0 && !user.user_nft_minted
          puts "Sending to user ##{user.id}"
          contract.transact_and_wait.airdrop([user.wallet_id])

          if contract.call.balance_of(user.wallet_id) != 1
            return false
          end
          address
        else
          puts "User ##{user.id} already owns a Level One token"
          false
        end
      end
    end

    private

    def abi
      @abi ||=
        begin
          file = File.open("app/services/web3/abi/CommunityUser.json")
          json_content = JSON.parse(file.read)
          json_content["abi"]
        end
    end

    def address
      @season_number == 2 ? ENV["COMMUNITY_USER_NFT_ADDRESS"] : ENV["COMMUNITY_USER_NFT_AIRDROP_ADDRESS"]
    end

    def contract
      @contract ||=
        begin
          c = Ethereum::Contract.create(
            name: "CommunityUser",
            address: address,
            abi: abi,
            client: client
          )
          c.key = key
          c
        end
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
