class Admin::Talent::BadgesController < ApplicationController
  before_action :set_talent
  before_action :set_badge, only: [:show, :update, :destroy]
  before_action :set_talent_badge, only: [:destroy]

  def index
    @badges = @talent.badges
  end

  def show
  end

  def new
    @badge = Badge.new
  end

  def create
    @talent_badge = TalentBadge.new(badge_params)
    @talent_badge.talent = @talent
    if @talent_badge.save
      redirect_to(
        admin_talent_badges_path(@talent),
        flash: {success: "Badge successfully created."}
      )
    else
      render :new
    end
  end

  def destroy
    if @talent_badge.destroy
      redirect_to(
        admin_talent_badges_path(@talent),
        flash: {success: "Badge successfully destroyed."}
      )
    else
      render :show
    end
  end

  private

  def set_talent
    @talent =
      if talent_id_param > 0
        Talent.find(params[:talent_id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def set_badge
    @badge = Badge.find(params[:id])
  end

  def set_talent_badge
    @talent_badge = TalentBadge.find_by(talent: @talent, badge: @badge)
  end

  def badge_params
    params.require(:badge).permit(:badge_id)
  end
end
