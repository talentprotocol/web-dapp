class TalentController < ApplicationController
  before_action :set_talent, only: [:show, :update]
  before_action :set_outer_talent, only: [:edit_profile]

  def index
    service = Talents::Search.new(filter_params: filter_params.to_h)
    @talents = service.call
  end

  def show
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @talent }
    end
  end

  def edit_profile
    if @talent.id != current_user.talent&.id
      redirect_to root_url
    end
  end

  private

  def filter_params
    params.permit(:name, :status)
  end

  def set_talent
    @talent =
      if id_param > 0
        Talent.includes(:user).find_by!(id: params[:id], user: {disabled: false})
      else
        Talent.includes(:user).find_by!(user: {username: params[:id], disabled: false})
      end
  end

  def set_outer_talent
    @talent = Talent.includes(:user).find_by!(user: {username: params[:talent_id]})
  end
end
