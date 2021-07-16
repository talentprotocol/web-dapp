class UsersController < ApplicationController
  def create
    service = CreateUser.new
    @user = service.call(
      email: user_params[:email],
      username: user_params[:username],
      metamask_id: user_params[:metamaskId]
    )

    if @user.present?
      render json: @user, status: :created
    else
      render json: {error: "Unable to create user"}, status: :conflict
    end
  end

  private

  def user_params
    params.permit(:email, :username, :metamaskId)
  end
end
