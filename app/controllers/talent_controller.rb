class TalentController < ApplicationController
  before_action :set_alert, only: :index
  before_action :set_talent, only: [:show, :update]

  def index
    @pagy, @talents = pagy(apply_filters(base_talent.includes(:primary_tag)), items: 6)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @talents }
    end
  end

  def show
    @talent_leaderboard = base_talent.where("ito_date < ?", Time.current).order(id: :desc).limit(10)

    @is_following = current_user.following.where(user_id: @talent.user.id).exists?

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @talent }
    end
  end

  def update
    if current_user.id != @talent.user_id
      return render json: {error: "You can't edit that profile."}, status: :unauthorized
    end

    profile_turned_public = !@talent.public && talent_params[:public] ? true : false

    result = @talent.update(talent_params)

    if result
      service = UpdateTalent.new(@talent)
      service.call(
        talent: params[:talent][:tags].present? && tag_params,
        user: params[:user].present? && user_params,
        token: params[:token].present? && token_params,
        public: talent_params[:public] && profile_turned_public
      )

      render json: {success: "Talent successfully updated."}, status: :ok
    else
      render json: {error: "Unable to update talent."}, status: :unprocessable_entity
    end
  end

  private

  def base_talent
    Talent.where(public: true).includes([:user, :token])
  end

  def apply_filters(talent)
    filtered_talent = talent_filter(talent)
    talent_sort(filtered_talent)
  end

  def set_alert
    # at some point we can extract this to application controller and search
    # for request.path - but for security reasons we might not want to do so
    @alert = AlertConfiguration.find_by(page: talent_index_path)
  end

  def set_talent
    @talent =
      if id_param > 0
        Talent.find(params[:id])
      else
        Talent.includes(:token).find_by!(token: {ticker: params[:id]})
      end
  end

  def talent_params
    params.require(:talent).permit(
      :linkedin_url,
      :youtube_url,
      :description,
      :public,
      profile_picture: {}
    )
  end

  def user_params
    params.require(:user).permit(:username)
  end

  def token_params
    params.require(:token).permit(:ticker)
  end

  def tag_params
    params.require(:talent).permit(:tags)
  end
end
