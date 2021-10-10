class API::V1::UsersController < ApplicationController
  before_action :set_user, only: [:update]

  def show
    @user = User.find_by(wallet_id: params[:id])

    if @user
      render json: {id: @user.id, profilePictureUrl: @user&.talent&.profile_picture_url || @user.investor.profile_picture_url}, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  def update
    if @user
      @user.update!(wallet_id: params[:wallet_id]&.downcase)
      render json: @user, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
  end
end
