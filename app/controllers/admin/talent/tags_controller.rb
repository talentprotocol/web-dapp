class Admin::Talent::TagsController < ApplicationController
  before_action :set_talent
  before_action :set_tag, only: [:show, :edit, :update, :destroy]

  def index
    @tags = @talent.tags
  end

  def show
  end

  def new
    @tag = @talent.tags.new
  end

  def create
    @tag = @talent.tags.new(reward_params)

    if @tag.save
      redirect_to(
        admin_talent_tags_path(@talent),
        flash: {success: "Tag successfully created."}
      )
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @tag.update(tag_params)
      redirect_to(
        admin_talent_tags_path(@talent),
        flash: {success: "Tag successfully updated."}
      )
    else
      render :edit
    end
  end

  def destroy
    if @tag.destroy
      redirect_to(
        admin_talent_tags_path(@talent),
        flash: {success: "Tag successfully destroyed."}
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

  def set_tag
    @tag = Tag.find(params[:id])
  end

  def tag_params
    params.require(:tag).permit(
      :description,
      :primary
    )
  end
end
