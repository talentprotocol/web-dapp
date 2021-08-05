class Admin::UsersController < ApplicationController
  before_action :set_user, only: [:show]

  def index
    @pagy, @users = pagy(User.all.order(:id), items: 15)
  end

  def show
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
