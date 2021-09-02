class Admin::UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update]

  def index
    @pagy, @users = pagy(get_users.order(id: :desc), items: 10)
  end

  def show
  end

  def edit
  end

  def update
    if @user.update(user_params)
      redirect_to(
        admin_users_path(@user),
        notice: "User successfully updated."
      )
    else
      render :edit
    end
  end

  private

  def get_users
    if params[:search]
      User.where("email ilike ? OR username ilike ?", "%#{params[:search]}%", "%#{params[:search]}%")
    else
      User.all
    end
  end

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:username, :role, :wallet_id)
  end
end
