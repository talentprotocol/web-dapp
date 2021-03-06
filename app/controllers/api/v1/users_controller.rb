class API::V1::UsersController < ApplicationController
  before_action :set_user, only: [:update, :destroy]

  def index
    @users = search_params[:name].present? ? filtered_users : filtered_users.limit(20)

    render json: {
      users: @users.includes(:investor, talent: :token).map { |u|
        {
          id: u.id,
          profilePictureUrl: u&.talent&.profile_picture_url || u.investor&.profile_picture_url,
          username: u.username,
          ticker: u.talent&.token&.display_ticker
        }
      }
    }, status: :ok
  end

  # Public endpoint
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
    if @user.nil? || current_user.nil? || @user.id != current_user.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if @user
      if params[:wallet_id]
        @user.update!(wallet_id: params[:wallet_id]&.downcase)

        SendCommunityNFTToUser.perform_later(user_id: @user.id)
        AddUsersToMailerliteJob.perform_later(@user.id)

        service = Web3::TransferCelo.new
        service.call(user: @user)
        UpdateTasksJob.perform_later(type: "Tasks::ConnectWallet", user_id: @user.id)
      elsif params[:welcome_pop_up]
        current_user.update!(welcome_pop_up: true)
      elsif params[:first_quest_popup]
        current_user.update!(first_quest_popup: true)
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

        if investor_params.present?
          service = API::UpdateInvestor.new(investor: @user.investor)
          service.call(investor_params: investor_params, tag_params: tag_params)
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
      :theme_preference, :username, :email, :messaging_disabled, :display_name,
      notification_preferences: {}
    )
  end

  def password_params
    params.require(:user).permit(:new_password, :current_password)
  end

  def investor_params
    if params[:investor].present?
      params.require(:investor).permit(
        profile: [
          :occupation, :location, :headline, :website, :video, :linkedin, :twitter, :telegram, :discord, :github
        ],
        profile_picture_data: {},
        banner_data: {}
      )
    else
      {}
    end
  end

  def tag_params
    params.permit(tags: [])
  end

  def filtered_users
    Users::Search.new(
      current_user: current_user,
      search_params: search_params.to_h
    ).call
  end
end
