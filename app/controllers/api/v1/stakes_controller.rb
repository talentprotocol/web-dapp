class API::V1::StakesController < ApplicationController
  def create
    token = Token.find_by(id: stake_params[:token_id])

    if token.talent.user_id != current_user.id
      TalentSupportersRefreshJob.perform_later(token.contract_id)
      CreateNotification.new.call(recipient: token.talent.user,
                                  type: TokenAcquiredNotification,
                                  source_id: current_user.id)

      if !current_user.tokens_purchased
        current_user.update!(tokens_purchased: true)
        AddUsersToMailerliteJob.perform_later(current_user.id)
        SendMemberNFTToUserJob.perform_later(user_id: current_user.id)
        UpdateQuestJob.perform_later(title: "Buy a Talent Token", user_id: current_user.id)
      end
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

  # Currently we don't want to automatically add follows when a user buys a talent token
  def add_follow(user_id)
    follow = Follow.find_or_initialize_by(user_id: user_id, follower_id: current_user.id)

    if !follow.persisted? && user_id != current_user.id
      follow.save
      SyncFollowerPostsJob.perform_later(user_id: user_id, follower_id: current_user.id)
    end
  end
end
