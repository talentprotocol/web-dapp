class API::V1::UsersController < ApplicationController
  before_action :set_user

  def update
    if @user
      @user.update!(user_params)
      render json: @user, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
  end

  def user_params
    params.permit(:wallet_id)
  end
end
