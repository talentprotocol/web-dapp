class EmailConfirmationsController < ApplicationController
  def update
    user = User.find_by!(email_confirmation_token: params[:token])
    user.confirm_email
    AddUsersToMailerliteJob.perform_later(user.id)
    sign_in user
    redirect_to root_path, flash: {success: "Account confirmed successfully."}
  end
end
