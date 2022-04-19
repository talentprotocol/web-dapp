class TalentController < ApplicationController
  def index
    service = Talents::Search.new(filter_params: backwards_compatible_params.to_h)
    talents = service.call
    @talents = talents.includes(:user, :token)
  end

  private

  def filter_params
    params.permit(:name, :keyword, :status)
  end

  def backwards_compatible_params
    backwards_compatible_params = filter_params
    backwards_compatible_params[:keyword] = filter_params[:name] if filter_params.key?(:name)

    backwards_compatible_params
  end
end
