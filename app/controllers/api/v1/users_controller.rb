class API::V1::UsersController < ApplicationController
  before_action :set_user, only: [:update]

  def index
    @users =
      if search_params[:name].present?
        User.includes(:investor, talent: [:token]).where.not(id: current_user.id).where("username ilike ? ", "%#{search_params[:name]}%")
      else
        User.includes(:investor, talent: [:token]).where.not(id: current_user.id).limit(20)
      end

    render json: {users: @users.map { |u| {id: u.id, profilePictureUrl: u&.talent&.profile_picture_url || u.investor.profile_picture_url, username: u.username, ticker: u.talent&.token&.display_ticker} }}, status: :ok
  end

  def show
    @user = User.find_by(wallet_id: params[:id])

    if @user
      render json: {id: @user.id, profilePictureUrl: @user&.talent&.profile_picture_url || @user.investor.profile_picture_url, username: @user.username}, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  def update
    if @user
      if params[:wallet_id]
        @user.update!(wallet_id: params[:wallet_id]&.downcase)
        service = Web3::TransferCelo.new
        service.call(user: @user)
      elsif params[:welcome_pop_up]
        current_user.update!(welcome_pop_up: true)
      else
        current_user.update!(user_params)
      end

      render json: @user, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  rescue ActiveRecord::RecordNotUnique
    render json: {error: "Wallet already exists in the system"}, status: :conflict
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
  end

  def search_params
    params.permit(:name)
  end

  def user_params
    params.permit(:theme_preference)
  end
end
