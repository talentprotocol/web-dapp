class API::V1::InvestorController < ApplicationController
  before_action :set_investor, only: [:update]

  def update
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
