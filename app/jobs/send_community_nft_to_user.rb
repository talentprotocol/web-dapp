class SendCommunityNFTToUser < ApplicationJob
  queue_as :default

  def perform(user_id:)
    if ENV["ENABLE_COMMUNITY_USER_NFT"] != "enable"
      return
    end

    user = User.find(user_id)

    service = Web3::MintUserNFT.new
    service.call(user: user)
  end
end
