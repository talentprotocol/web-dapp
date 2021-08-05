class Admin::TalentController < ApplicationController
  before_action :set_talent, only: [:show, :edit, :update, :destroy]

  def index
    @talents = Talent.all
  end

  def show
  end

  def new
    @talent = Talent.new(talent_params)
  end

  def create
    @talent = Talent.new(talent_params)

    if @talent.save
      redirect_to(
        admin_talent_path(@talent),
        notice: "Talent successfully created."
      )
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @talent.update(talent_params)
      redirect_to(
        admin_talent_path(@talent),
        notice: "Talent successfully updated."
      )
    else
      render :edit
    end
  end

  def destroy
    if @talent.destroy
      redirect_to(
        admin_talent_index_path,
        notice: "Talent successfully destroyed."
      )
    else
      render :show
    end
  end

  private

  def set_talent
    @talent =
      if id_param > 0
        Talent.find(params[:id])
      else
        Talent.find_by!(public_key: params[:id])
      end
  end

  def talent_params
    params.require(:talent).permit(
      :user_id,
      :public_key,
      :description,
      :profile_picture,
      :linkedin_url,
      :youtube_url,
      :ito_date
    )
  end
end
