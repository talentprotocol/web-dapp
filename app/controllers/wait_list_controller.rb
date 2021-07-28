class WaitListController < ApplicationController
  def create
    if User.where(email: wait_list_create_params[:email]).exists?
      render json: {error: "There exists a user with that email already."}, status: :conflict
    else
      wait_list = WaitList.create(wait_list_create_params)

      render json: wait_list, status: :ok
    end
  rescue ActiveRecord::RecordNotUnique
    render json: {error: "You're already on it! The email already exists in the wait list."}, status: :conflict
  end

  def index
    @wait_list = WaitList.find_by(wait_list_index_params)

    if @wait_list.present?
      render json: @wait_list, status: :ok
    else
      render json: {error: "There is no wait list for that email or id"}, status: :not_found
    end
  end

  private

  def wait_list_create_params
    params.permit(:email)
  end

  def wait_list_index_params
    params.permit(:id, :email)
  end
end
