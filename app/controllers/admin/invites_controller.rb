class Admin::InvitesController < ApplicationController
  before_action :load_subscribers, only: [:new]
  def index
    @pagy, @invites = pagy(Invite.all.order(id: :desc))
  end

  def new
    @invite = Invite.new
  end

  def create
    service = CreateInvite.new(user_id: current_user.id)
    @invite = service.call

    UserMailer.with(invite: @invite, email: invite_params[:email]).send_invite_email.deliver_later

    if @invite.save
      redirect_to(
        admin_invites_path,
        flash: {success: "Sent an invite to #{invite_params[:email]}."}
      )
    else
      render :new
    end
  end

  private

  def load_subscribers
    service = Mailerlite::GetSubscribers.new
    @subscribers = service.call.map { |s| [s.email, s.email] }
  end

  def invite_params
    params.require(:invite).permit(:email)
  end
end
