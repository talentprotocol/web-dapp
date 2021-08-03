class SessionsController < Clearance::SessionsController
  def create
    if metamask_login?
      @user = User.find_by(wallet_id: metamask_params[:wallet_id])

      web3_auth = Web3::Auth.new

      if web3_auth.verify_wallet(user: @user, signature: metamask_params[:signed_message]) && sign_in(@user)
        @user.update!(nounce: SecureRandom.uuid)

        render json: {success: user_root_path}
      else
        flash.now.alert = "Unable to verify you have ownership over the address."
        render template: "sessions/new", status: :unauthorized
      end
    else
      super
    end
  end

  private

  def metamask_login?
    metamask_params[:signed_message].present? && metamask_params[:wallet_id].present?
  end

  def metamask_params
    params.permit(:signed_message, :wallet_id)
  end
end
