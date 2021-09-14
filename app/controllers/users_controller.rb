class UsersController < ApplicationController
  def index
    if user_params[:email].present?
      @user = User.find_by(email: user_params[:email].downcase)
    elsif user_params[:username].present?
      @user = User.find_by(username: user_params[:username])
    end

    if @user.present?
      @user.update!(nounce: SecureRandom.uuid) if @user.nounce.nil?

      render json: { id: @user.id, nounce: @user.nounce }, status: :ok
    else
      render json: { error: "Couldn't find the user for that email or username" }, status: :not_found
    end
  end

  def create
    service = CreateUser.new
    @result = service.call(
      email: user_params[:email],
      username: user_params[:username],
      password: user_params[:password],
    )

    if @result[:success]
      render json: @result[:user], status: :created
    else
      render json: @result, status: :conflict
    end
  end

  private

  def user_params
    params.permit(:email, :username, :password)
  end
end
