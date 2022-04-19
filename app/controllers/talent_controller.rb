class TalentController < ApplicationController
  def index
    service = Talents::Search.new(filter_params: filter_params.to_h)
    talents = service.call
    @talents = talents.includes(:user, :token)
  end

  private

  def filter_params
    params.permit(:keyword, :status)
  end
end
