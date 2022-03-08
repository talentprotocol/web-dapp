class API::V1::UsersController < ApplicationController
  before_action :set_user, only: [:update, :destroy]

  def index
    @users = search_params[:name].present? ? filtered_users : filtered_users.limit(20)

    render json: {
      users: @users.includes(:talent, :investor).map { |u|
        {
          id: u.id,
          profilePictureUrl: u&.talent&.profile_picture_url || u.investor&.profile_picture_url,
          username: u.username,
          ticker: u.talent&.token&.display_ticker
        }
      }
    }, status: :ok
  end

  def show
    @user = User.find_by(wallet_id: params[:id])

    if @user
      render json: {
        id: @user.id,
        profilePictureUrl: @user&.talent&.profile_picture_url || @user.investor.profile_picture_url,
        username: @user.username,
        messagingDisabled: @user.messaging_disabled
      }, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  def update
    if @user.nil? || @user.id != current_user.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if @user
      if params[:wallet_id]
        @user.update!(wallet_id: params[:wallet_id]&.downcase)
        service = Web3::TransferCelo.new
        service.call(user: @user)
      elsif params[:welcome_pop_up]
        current_user.update!(welcome_pop_up: true)
      else
        if password_params[:new_password]&.length&.positive?
          if current_user.authenticated?(password_params[:current_password])
            current_user.update!(password: password_params[:new_password])
          else
            return render json: {errors: {currentPassword: "Passwords don't match"}}, status: :conflict
          end
        elsif !!user_params[:username] && !User.valid_username?(user_params[:username])
          return render json: {errors: {username: "Username only allows lower case letters and numbers"}}, status: :conflict
        elsif !!user_params[:email] && !User.valid_email?(user_params[:email])
          return render json: {errors: {email: "Email is not valid"}}, status: :conflict
        end

        current_user.update!(user_params)

        if investor_params.present? && investor_params[:profile_picture_data].present?
          current_user.investor.profile_picture = investor_params[:profile_picture_data].as_json
          current_user.investor.save!
        end
      end

      render json: @user, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  rescue ActiveRecord::RecordNotUnique => e
    if e.to_s.include?("username")
      render json: {errors: {username: "Username is taken"}}, status: :conflict
    elsif e.to_s.include?("email")
      render json: {errors: {email: "Email is taken"}}, status: :conflict
    else
      render json: {errors: "Wallet already exists in the system"}, status: :conflict
    end
  end

  def destroy
    if @user.id != current_user.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if current_user.authenticated?(password_params[:current_password])
      service = DestroyUser.new(user_id: current_user.id)
      result = service.call

      if result
        render json: {success: "User destroyed."}, status: :ok
      else
        render json: {errors: "Unabled to destroy user"}, status: :conflict
      end
    else
      render json: {errors: "Unabled to destroy user"}, status: :conflict
    end
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
  end

  def search_params
    params.permit(:name, :messaging_disabled)
  end

  def user_params
    params.require(:user).permit(
      :theme_preference, :username, :email, :messaging_disabled,
      notification_preferences: {}
    )
  end

  def password_params
    params.require(:user).permit(:new_password, :current_password)
  end

  def investor_params
    if params[:investor].present?
      params.require(:investor).permit(profile_picture_data: {})
    else
      {}
    end
  end

  def filtered_users
    Users::Search.new(
      current_user: current_user,
      search_params: search_params.to_h
    ).call
  end
end
