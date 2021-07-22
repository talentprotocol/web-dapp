class FollowsController < ApplicationController
  def index
    @follows = current_user.follows
    @following = current_user.following
  end

  def create
    @follow = Follow.new(user: follow_params[:user_id], follower: current_user)

    if @follow.save
      render json: {success: "Follow successfully created."}, status: :created
    else
      render json: {error: "Unable to follow."}, status: :bad_request
    end
  end

  def destroy
    @follow = Follow.find_by(user: follow_params[:user_id], follower: current_user)

    if @follow.present? && @follow.destroy
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
