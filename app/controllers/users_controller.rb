class UsersController < ApplicationController
  def create
    service = CreateUser.new
    @result = service.call(
      email: user_params[:email],
      username: user_params[:username],
      metamask_id: user_params[:metamaskId]
    )

    if result[:success]
      render json: @user, status: :created
    else
      render json: @result, status: :conflict
    end
  end

  private

  def user_params
    params.permit(:email, :username, :metamaskId)
  end
end
