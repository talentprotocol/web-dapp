class API::V1::StakesController < ApplicationController
  def create
    token = Token.find_by(id: stake_params[:token_id])

    if token.talent.user_id != current_user.id
      create_notification_talent_token_bought(token.talent.user_id, current_user)
    end

    render json: {success: "Stake created."}, status: :ok
  end

  private

  def stake_params
    params.require(:stake).permit(
      :token_id
    )
  end

  def create_notification_talent_token_bought(talent_user_id, user)
    name = user.display_name || user.username
    service = CreateNotification.new
    service.call(
      title: "Supporter",
      body: "#{name} bought more of your talent token",
      user_id: talent_user_id,
      type: "Notifications::TokenAcquired"
    )
  end
end
