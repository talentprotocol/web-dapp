class API::V1::SupportersController < ApplicationController
  # This is a public endpoint
  def index
    @users = User.includes(:talent, :investor).where(wallet_id: wallet_ids)
    user_data = @users.map do |u|
      {
        id: u.id,
        wallet_id: u.wallet_id,
        profilePictureUrl: u&.talent&.profile_picture_url || u.investor.profile_picture_url,
        username: u.username,
        messagingDisabled: u.messaging_disabled
      }
    end

    render json: {supporters: user_data}, status: :ok
  end

  private

  def wallet_ids
    params.require(:supporters)
  end
end
