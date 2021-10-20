class Talent::SupportersController < ApplicationController
  before_action :set_talent, only: [:index]

  def index
    supporter_ids = @talent.token.transactions.distinct.pluck(:investor_id)
    @supporters = User.joins(:investor).where(investors: {id: supporter_ids})
  end

  private

  def set_talent
    @talent =
      if talent_id_param > 0
        Talent.find(params[:talent_id])
      else
        Talent.includes(:user).find_by!(user: {username: params[:talent_id]})
      end
  end
end
