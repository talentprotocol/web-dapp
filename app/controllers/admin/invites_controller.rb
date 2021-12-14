class Admin::InvitesController < ApplicationController
  before_action :load_subscribers, only: [:index]

  def index
    if request.params[:success]
      flash[:success] = "Email sent to #{request.params[:success]}."
    end
    if request.params[:error]
      flash[:error] = "User is already registered with that email."
    end
  end

  def create
    if User.where(email: new_invite_params[:email]).exists?
      return render json: {error: "Unable to send the email"}
    end

    service = CreateInvite.new(user_id: 1, single_use: true, talent_invite: new_invite_params[:talent_invite])
    @invite = service.call

    service = Mailerlite::AddSubscriber.new
    service.call(new_invite_params[:email], new_invite_params[:name])

    if @invite
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
    params.require(:invite).permit(:email, :name, :talent_invite)
  end
end
