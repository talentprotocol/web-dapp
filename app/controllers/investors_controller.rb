class InvestorsController < ApplicationController
  before_action :set_investor, only: [:update]

  def update
    if @investor.id != current_user.investor.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if @investor.update(investor_params)
      redirect_to(
        settings_path,
        flash: {success: "Successfully updated your profile picture."}
      )
    else
      redirect_to(
        settings_path,
        flash: {danger: "Unable to update your profile picture, the file is too large."}
      )
    end
  end

  private

  def set_investor
    @investor = Investor.find(params[:id])
  end

  def investor_params
    params.require(:investor).permit(
      :profile_picture
    )
  end
end
