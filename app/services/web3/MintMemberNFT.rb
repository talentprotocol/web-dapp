module Web3
  class MintMemberNFT
    def call(user:)
      if user.wallet_id && !user.member_nft_minted
        service = NFT::GenerateMemberNFT.new(user: user)
        image_url = service.call

        resp = client.invoke({
          function_name: ENV["MEMBER_NFT_LAMBDA_FUNCTION"],
          invocation_type: "RequestResponse",
          log_type: "None",
          payload: JSON.generate({
            wallet_id: user.wallet_id,
            image_url: image_url,
            image_name: "member_#{user.username}.jpg"
          })
        })

        response = JSON.parse(resp.payload.string)

        if response["statusCode"] == 200
          user.update!(
            member_nft_minted: true,
            member_nft_address: response["body"]["tokenAddress"],
            member_nft_token_id: response["body"]["tokenId"],
            member_nft_tx: response["body"]["tx"]
          )
        elsif response["statusCode"] == 400 && response["body"]["errorId"] == 2
          user.update!(
            member_nft_minted: true,
            member_nft_address: response["body"]["tokenAddress"],
            member_nft_token_id: response["body"]["tokenId"]
          )
        else
          log_error(user)
          false
        end
      end
    end

    private

    def log_error(user)
      if Rails.env.production?
        Rollbar.warning("Unable to airdrop the Member NFT to user ##{user.id}")
      else
        puts "There was an issue airdropping the Member NFT to ##{user.id}"
      end
    end

    def client
      @client ||= Aws::Lambda::Client.new(region: "eu-west-2")
    end
  end
end
