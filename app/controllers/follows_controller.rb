class FollowsController < ApplicationController
  def index
    @follows = current_user.follows
    @following = current_user.following
  end

  def create
    service = CreateFollow.new
    success = service.call(user_id: follow_params[:user_id], follower_id: current_user.id)

    if success
      render json: {success: "Follow successfully created."}, status: :created
    else
      render json: {error: "Unable to follow."}, status: :bad_request
    end
  end

  def destroy
    service = DeleteFollow.new
    success = service.call(user_id: follow_params[:user_id], follower_id: current_user.id)

    if success
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
