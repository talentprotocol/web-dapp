class Admin::InvitesController < ApplicationController
  before_action :load_subscribers, only: [:index]

  def index
    if request.params[:success]
      flash[:success] = "Email sent to #{request.params[:success]}."
    end
  end

  def create
    service = CreateInvite.new(user_id: 1, single_use: true)
    @invite = service.call

    UserMailer.with(invite: @invite, email: new_invite_params[:email]).send_invite_email.deliver_later

    if @invite.save
      render json: {success: "Sent an invite link"}, status: :ok
    else
      render json: {error: "Unable to send the email"}, status: :conflict
    end
  end

  private

  def set_invite
    @invite = Invite.find(params[:id])
  end

  def load_subscribers
    service = Mailerlite::GetSubscribers.new(page: params[:page], search: params[:search])
    @subscribers = service.call
  end

  def new_invite_params
    params.require(:invite).permit(:email)
  end
end
