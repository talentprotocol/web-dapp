class TalentController < ApplicationController
  def index
    service = Talents::Search.new(filter_params: filter_params.to_h)
    talents = service.call
    @talents = TalentBlueprint.render_as_json(talents.includes(:user, :token), view: :normal, current_user_watchlist: current_user_watchlist)
  end

  private

  def filter_params
    params.permit(:keyword, :status)
  end
end
