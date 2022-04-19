class SendCommunityNFTToUser < ApplicationJob
  queue_as :default

  def perform(user_id:)
    if ENV["ENABLE_COMMUNITY_USER_NFT"] != "enable"
      return
    end

    user = User.find(user_id)

    invite = user.invites.where(talent_invite: false).first
    if invite.present?
      invite.update!(max_uses: nil)
    end

    service = Web3::MintUserNFT.new
    service.call(user: user)
  end
end
