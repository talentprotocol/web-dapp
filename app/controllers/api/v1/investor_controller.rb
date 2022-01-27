class API::V1::InvestorController < ApplicationController
  before_action :set_investor, only: [:update]

  def update
    if @investor.id != current_user.investor.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if @investor.update(investor_params)
      render json: @investor, status: :ok
    else
      render json: {error: "Unable to update Investor."}, status: :unprocessable_entity
    end
  end

  private

  def set_investor
    @investor = Investor.find(params[:id])
  end

  def investor_params
    params.require(:investor).permit(
      profile_picture: {}
    )
  end
end
