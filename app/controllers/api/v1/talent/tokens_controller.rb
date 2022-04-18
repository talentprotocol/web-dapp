class API::V1::Talent::TokensController < ApplicationController
  after_action :notify_of_change

  def update
    if current_user.nil? || talent.id != current_user.talent.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    was_deployed = token.deployed

    if token.update(token_params)
      if token.deployed? && !was_deployed
        token.update!(deployed_at: Time.current)
        talent.update(public: true, supporters_count: 0, total_supply: Talent.base_supply)
        service = CreateInvite.new(user_id: current_user.id, single_use: true, talent_invite: true)
        invite = service.call
        AddRewardToInviterJob.perform_later(token.id)
        AddUsersToMailerliteJob.perform_later(current_user.id)
        SendMemberNFTToUserJob.perform_later(user_id: current_user.id)
        UpdateQuestJob.perform_later(title: "Complete Profile and set it public", user_id: current_user.id)
        UpdateQuestJob.perform_later(title: "Launch your token", user_id: current_user.id)
      end
      CreateNotificationTalentChangedJob.perform_later(talent.user.followers.pluck(:follower_id), talent.user_id)
      render json: token.as_json.merge(code: invite&.code), status: :ok
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
end
