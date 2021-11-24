class API::V1::PerksController < ApplicationController
  before_action :set_perk, only: [:show]

  def show
    if @perk.present?
      render json: @perk, status: :ok
    else
      render json: {message: "the perk does not exist."}, status: :not_found
    end
  end

  private

  def set_perk
    @perk = Perk.find(params[:id])
  end
end
