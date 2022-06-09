class API::V1::Talent::TokensController < ApplicationController
  after_action :notify_of_change

  def update
    if current_user.nil? || talent.id != current_acting_user.talent.id || cannot_launch_token
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    was_deployed = token.deployed

    if token.update(token_params)
      if token.deployed? && !was_deployed
        token.update!(deployed_at: Time.current)
        talent.update!(public: true, supporters_count: 0, total_supply: Talent.base_supply)
        current_user.update!(profile_type: "talent")
        AddRewardToInviterJob.perform_later(token.id)
        AddUsersToMailerliteJob.perform_later(current_user.id)
        SendMemberNFTToUserJob.perform_later(user_id: current_user.id)
        UpdateTasksJob.perform_later(type: "Tasks::PublicProfile", user_id: current_user.id)
        UpdateTasksJob.perform_later(type: "Tasks::LaunchToken", user_id: current_user.id)
        SendTokenNotificationToDiscordJob.perform_later(token.id)
      end
      CreateNotificationTalentChangedJob.perform_later(talent.user.followers.pluck(:follower_id), talent.user_id)
      render json: token.as_json, status: :ok
    else
      render json: {error: "Unable to update Token"}, status: :unprocessable_entity
    end
  end

  private

  def notify_of_change
    CreateNotificationTalentChangedJob.perform_later(talent.user.followers.pluck(:follower_id), talent.user_id)
  end

  def talent
    @talent ||=
      if talent_id_param
        Talent.find(params[:talent_id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def token
    @token ||= Token.find(params[:id])
  end

  def token_params
    params.require(:token).permit(
      :ticker,
      :contract_id,
      :deployed
    )
  end

  def cannot_launch_token
    !current_user.approved? && !current_user.talent?
  end
end
