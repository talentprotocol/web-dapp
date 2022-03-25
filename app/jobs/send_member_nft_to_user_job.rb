class SendMemberNFTToUserJob < ApplicationJob
  queue_as :default

  def perform(user_id:)
    return if ENV["ENABLE_COMMUNITY_MEMBER_NFT"] != "enable"

    user = User.find(user_id)

    service = Web3::MintMemberNFT.new
    service.call(user: user)
  end
end
