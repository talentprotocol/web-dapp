class WaitListController < ApplicationController
  def create
    if User.where(email: wait_list_create_params[:email]).exists?
      render json: {error: "This email already exists in the database, you should be able to sign in with it."}, status: :conflict
    else
      wait_list = WaitList.create(email: wait_list_create_params[:email].downcase)

      render json: wait_list, status: :ok
    end
  rescue ActiveRecord::RecordNotUnique
    render json: {error: "This email already exists in the allowlist. Click back and validate"}, status: :conflict
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
