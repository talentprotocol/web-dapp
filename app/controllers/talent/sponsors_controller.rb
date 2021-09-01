class Talent::SponsorsController < ApplicationController
  before_action :set_talent, only: [:index]

  def index
    sponsor_ids = @talent.token.transactions.distinct.pluck(:investor_id)
    @sponsors = User.joins(:investor).where(investors: {id: sponsor_ids})
  end

  private

  def set_talent
    @talent ||= Talent.find(params[:talent_id])
  end
end
