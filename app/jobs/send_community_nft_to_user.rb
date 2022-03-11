class SendCommunityNFTToUser < ApplicationJob
  queue_as :default

  def perform(user_id)
    if ENV["ENABLE_COMMUNITY_USER_NFT"] != "enable"
      return
    end

    ActiveRecord::Base.transaction do
      user = User.find(user_id)

      service = Web3::MintUserNFT.new(season: 2)
      result = service.call(user: user)
      if result
        user.update!(user_nft_minted: true, user_nft_address: result)
      end
    rescue => e
      Rollbar.error(e, "Unable to send NFT to user ##{user_id}")

      raise ActiveRecord::Rollback.new(e)
    end
  end
end
