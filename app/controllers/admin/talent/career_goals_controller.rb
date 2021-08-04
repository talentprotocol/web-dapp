class Admin::Talent::CareerGoalsController < ApplicationController
  before_action :validate_access

  def show
    talent
    career_goal
  end

  def edit
    talent
    career_goal
  end

  def update
    if @career_goal.update(career_goal_params)
      redirect_to(
        admin_user_path(@talent.user),
        flash: {success: "Talent's career goal successfully updated."}
      )
    else
      render :edit
    end
  end

  private

  def talent
    @talent ||=
      if talent_id_param
        Talent.find(params[:talent_id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def career_goal
    @career_goal ||= CareerGoal.find(params[:id])
  end

  def validate_access
    if talent.career_goal != career_goal
      redirect_to root_path, flash: {error: "This isn't the career goal you're looking for."}
    end
  end

  def career_goal_params
    params.require(:career_goal).permit(
      :description,
      :target_date
    )
  end
end
