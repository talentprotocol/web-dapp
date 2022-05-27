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

  def upgrade_profile_to_talent
    investor = Investor.find(params[:supporter_id])
    if investor.id != current_user.investor.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    Supporter::UpgradeToTalent.new.call(user_id: investor.user.id, applying: true)

    render json: {}, status: :ok
  end

  private

  def wallet_ids
    params.require(:supporters)
  end
end
