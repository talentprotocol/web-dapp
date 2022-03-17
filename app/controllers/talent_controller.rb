class TalentController < ApplicationController
  def index
    service = Talents::Search.new(filter_params: filter_params.to_h)
    @talents = service.call
  end

  private

  def filter_params
    params.permit(:name, :status)
  end
end
