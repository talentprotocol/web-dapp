class Admin::InvitesController < ApplicationController
  before_action :load_subscribers, only: [:new]
  before_action :set_invite, only: [:show, :edit, :update, :destroy]

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

    UserMailer.with(invite: @invite, email: new_invite_params[:email]).send_invite_email.deliver_later

    if @invite.save
      render json: {success: "Sent an invite link"}, status: :ok
    else
      render json: {error: "Unable to send the email"}, status: :conflict
    end
  end

  def show
  end

  def edit
  end

  def update
    if @invite.update(invite_params)
      redirect_to(
        admin_invite_path(@invite),
        flash: {success: "Successfully updated the invite."}
      )
    else
      render :edit
    end
  end

  def destroy
    if @invite.destroy
      redirect_to(
        admin_invites_path,
        flash: {warning: "Invite successfully destroyed."}
      )
    else
      render :show
    end
  end

  private

  def set_invite
    @invite = Invite.find(params[:id])
  end

  def load_subscribers
    service = Mailerlite::GetSubscribers.new
    @subscribers = service.call.map(&:email)
  end

  def new_invite_params
    params.require(:invite).permit(:email)
  end

  def invite_params
    params.require(:invite).permit(:code, :uses, :max_uses, :talent_invite)
  end
end
