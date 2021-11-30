class API::V1::StakesController < ApplicationController
  def create
    token = Token.find_by(id: stake_params[:token_id])

    if token.talent.user_id != current_user.id
      current_user.update!(tokens_purchased: true)
      create_notification_talent_token_bought(token.talent.user_id, current_user)
      # add_follow(token.talent.user_id)
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
    name = user.display_name.present? ? user.display_name : user.username
    service = CreateNotification.new
    service.call(
      title: "Supporter",
      body: "#{name} bought more of your talent token",
      user_id: talent_user_id,
      source_id: user.id,
      type: "Notifications::TokenAcquired"
    )
  end

  # Currently we don't want to automatically add follows when a user buys a talent token
  def add_follow(user_id)
    follow = Follow.find_or_initialize_by(user_id: user_id, follower_id: current_user.id)

    if !follow.persisted? && user_id != current_user.id
      follow.save
      SyncFollowerPostsJob.perform_later(user_id: user_id, follower_id: current_user.id)
    end
  end
end
