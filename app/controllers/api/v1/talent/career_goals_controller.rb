class API::V1::Talent::CareerGoalsController < ApplicationController
  def update
    if talent.id != current_user.talent.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if career_goal.update(career_goal_params)
      render json: career_goal, status: :ok
    else
      render json: {error: "Unable to update Career goal"}, status: :unprocessable_entity
    end
  end

  def create
    @career_goal = CareerGoal.new(career_goal_params)
    @career_goal.talent = talent

    if @career_goal.save
      render json: @career_goal, status: :created
    else
      render json: {error: "Unable to create career goal"}, status: :unprocessable_entity
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

  def career_goal_params
    params.require(:career_goal).permit(
      :bio,
      :pitch,
      :challenges
    )
  end
end
