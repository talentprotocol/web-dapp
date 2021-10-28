class Admin::InvitesController < ApplicationController
  before_action :load_subscribers, only: [:new]
  def index
    if request.params[:success]
      flash[:success] = "Email sent to #{request.params[:success]}."
    end
    @pagy, @invites = pagy(Invite.all.order(id: :desc))
  end

  def new
  end

  def create
    service = CreateInvite.new(user_id: current_user.id)
    @invite = service.call

    UserMailer.with(invite: @invite, email: invite_params[:email]).send_invite_email.deliver_later

    if @invite.save
      render json: {success: "Sent an invite link"}, status: :ok
    else
      render json: {error: "Unable to send the email"}, status: :conflict
    end
  end

  private

  def load_subscribers
    service = Mailerlite::GetSubscribers.new
    @subscribers = service.call.map(&:email)
  end

  def invite_params
    params.require(:invite).permit(:email)
  end
end
