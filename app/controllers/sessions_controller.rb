class SessionsController < Clearance::SessionsController
  def create
    if metamask_id.present?
      @user = User.find_by(wallet_id: metamask_id.downcase)

      if valid_metamask? && sign_in(@user)
        redirect_back_or url_after_create
      else
        flash.now.alert = "Unable to sign in using metamask"
        render template: "sessions/new", status: :unauthorized
      end
    else
      super
    end
  end

  private

  def valid_metamask?
    true # implement later
  end

  def metamask_params
    params.permit(session: :metamask_id)
  end

  def metamask_id
    metamask_params[:session][:metamask_id]
  end
end
