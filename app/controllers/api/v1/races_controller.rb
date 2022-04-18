class API::V1::RacesController < ApplicationController
  before_action :set_race

  def show
    if @race
      service = PrepareRaceResults.new(race: @race, user: current_user)
      @race_results = service.call

      render json: @race_results, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  private

  def set_race
    @race = Race.find_by(id: params[:id])
  end
end
