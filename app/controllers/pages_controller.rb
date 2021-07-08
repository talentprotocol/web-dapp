class PagesController < ApplicationController
  def home
  end

  def wait_list
    WaitList.create(wait_list_params)

    redirect_to root_path, flash: {success: "Thank you for signing up. We'll be in touch"}
  end

  private

  def wait_list_params
    params.permit(:email)
  end
end
