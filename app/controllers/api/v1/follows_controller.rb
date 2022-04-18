class API::V1::FollowsController < ApplicationController
  def index
    @follows = current_user.follows
    @following = current_user.following
  end

  def create
    follow = Follow.find_or_initialize_by(user_id: follow_params[:user_id], follower_id: current_user.id)

    if follow.persisted?
      render json: {error: "Already following."}, status: :conflict
    elsif follow.save
      # if params[:user_id] != current_user.id
      #   SyncFollowerPostsJob.perform_later(user_id: follow_params[:user_id], follower_id: current_user.id)
      # end

      task_done = Task
        .joins(:quest)
        .where(title: "Add 3 talent to watchlist")
        .where(quest: {user: current_user})
        .take
        .done?

      if Follow.where(follower_id: current_user.id).count > 2 && !task_done
        current_user.invites.where(talent_invite: false).update_all(max_uses: nil)
        UpdateQuestJob.perform_later(title: "Add 3 talent to watchlist", user_id: current_user.id)
      end

      render json: {success: "Follow successfully created."}, status: :created
    else
      render json: {error: "Unable to create follow."}, status: :bad_request
    end
  end

  def destroy
    follow = Follow.find_by(user_id: follow_params[:user_id], follower_id: current_user.id)

    if follow&.destroy
      # if params[:user_id] != current_user.id
      #   DeSyncFollowerPostsJob.perform_later(user_id: follow_params[:user_id], follower_id: current_user.id)
      # end

      render json: {success: "Follow successfully removed."}, status: :ok
    else
      render json: {error: "Follow does not exist."}, status: :not_found
    end
  end

  private

  def follow_params
    params.permit(:user_id)
  end
end
