class Admin::BadgesController < ApplicationController
  before_action :set_badge, only: [:show, :edit, :update, :destroy]

  def index
    @pagy, @badges = pagy(badges.order(id: :desc), items: 10)
  end

  def show
  end

  def new
    @badge = Badge.new
  end

  def create
    @badge = Badge.new(badge_params)

    if @badge.save
      redirect_to(
        admin_badge_path(@badge),
        flash: { success: "Successfully created badge." }
      )
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @badge.update(badge_params)
      redirect_to(admin_badge_path(@badge), notice: "Badge successfully updated.")
    else
      render :edit
    end
  end

  def destroy
    if @badge.destroy
      redirect_to(
        admin_badges_path,
        flash: { warning: "Badge successfully destroyed." }
      )
    else
      render :show
    end
  end

  private

  def badges
    if params[:search]
      Badge.where("url ilike ? OR alt ilike ?", "%#{params[:search]}%", "%#{params[:search]}%")
    else
      Badge.all
    end
  end

  def set_badge
    @badge = Badge.find(params[:id])
  end

  def badge_params
    params.require(:badge).permit(:name, :url, :alt, :image)
  end
end
