module Web3
  class MintUserNFT
    def call(user:)
      if user.wallet_id && !user.user_nft_minted
        resp = client.invoke({
          function_name: ENV["USER_NFT_LAMBDA_FUNCTION"],
          invocation_type: "RequestResponse",
          log_type: "None",
          payload: JSON.generate({wallet_id: user.wallet_id})
        })

        response = JSON.parse(resp.payload.string)

        if response["statusCode"] == 200
          user.update!(
            user_nft_minted: true,
            user_nft_address: response["body"]["tokenAddress"],
            user_nft_token_id: response["body"]["tokenId"],
            user_nft_tx: response["body"]["tx"]
          )
        else
          puts "User ##{user.id} already owns a Level One token"
          false
        end
      end
    end

    private

    def client
      @client ||= Aws::Lambda::Client.new(region: "eu-west-2")
    end
  end
end
