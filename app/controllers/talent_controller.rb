class TalentController < ApplicationController
  before_action :set_talent, only: [:show, :update]
  before_action :set_outer_talent, only: [:edit_profile]

  def index
    @talents = apply_filters(base_talent.includes(:primary_tag, :user))
    @active_talents = @talents.where.not(token: {contract_id: nil})
    @upcoming_talents = @talents.where(token: {contract_id: nil})

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @talents }
    end
  end

  def show
    @is_following = current_user.following.where(user_id: @talent.user.id).exists?

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @talent }
    end
  end

  def edit_profile
    @is_following = current_user.following.where(user_id: @talent.user.id).exists?
  end

  private

  def base_talent
    Talent.where(public: true).includes([:user, :token])
  end

  def apply_filters(talent)
    filtered_talent = talent_filter(talent)
    talent_sort(filtered_talent)
  end

  def set_talent
    @talent =
      if id_param > 0
        Talent.find(params[:id])
      else
        Talent.includes(:user).find_by!(user: {username: params[:id]})
      end
  end

  def set_outer_talent
    @talent = Talent.includes(:user).find_by!(user: {username: params[:talent_id]})
  end
end
