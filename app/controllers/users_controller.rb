class UsersController < ApplicationController
  def index
    @user = User.find_by(wallet_id: user_params[:wallet_id])

    if @user.present?
      @user.update!(nounce: SecureRandom.uuid) if @user.nounce.nil?

      render json: {id: @user.id, nounce: @user.nounce}, status: :ok
    else
      render json: {error: "Couldn't find the user for the wallet address provided"}, status: :not_found
    end
  end

  def create
    service = CreateUser.new
    @result = service.call(
      email: user_params[:email],
      username: user_params[:username],
      metamask_id: user_params[:metamaskId]
    )

    if @result[:success]
      render json: @result[:user], status: :created
    else
      render json: @result, status: :conflict
    end
  end

  private

  def user_params
    params.permit(:email, :username, :metamaskId, :wallet_id)
  end
end
