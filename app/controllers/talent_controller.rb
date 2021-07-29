class TalentController < ApplicationController
  before_action :set_alert, only: :index

  def index
    @pagy, @talents = pagy(apply_filters(Talent.all), items: 6)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @talents }
    end
  end

  def show
    @talent =
      if id_param
        Talent.find(params[:id])
      else
        Talent.find_by!(public_key: params[:id])
      end

    @talent_leaderboard = Talent.order(id: :desc).limit(10)

    @is_following = current_user.following.where(user_id: @talent.user.id).exists?

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @talent }
    end
  end

  private

  def apply_filters(talent)
    filtered_talent = talent_filter(talent)
    talent_sort(filtered_talent)
  end

  def set_alert
    # at some point we can extract this to application controller and search
    # for request.path - but for security reasons we might not want to do so
    @alert = AlertConfiguration.find_by(page: talent_index_path)
  end
end
