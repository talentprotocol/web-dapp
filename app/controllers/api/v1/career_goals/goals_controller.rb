class API::V1::CareerGoals::GoalsController < ApplicationController
  before_action :validate_access

  def update
    if goal.update(goal_params)
      render json: goal, status: :ok
    else
      render json: {error: "Unable to update goal"}, status: :unprocessable_entity
    end
  end

  def create
    @goal = Goal.new(goal_params)
    parsed_date = goal_params[:due_date].split("-").map(&:to_i)
    @goal.due_date = Date.new(parsed_date[0], parsed_date[1])
    @goal.career_goal = career_goal

    if @goal.save
      render json: @goal, status: :created
    else
      render json: {error: "Unable to create goal"}, status: :unprocessable_entity
    end
  end

  def destroy
    if goal.destroy
      render json: goal, status: :ok
    else
      render json: {error: "Unable to delete requested goal."}, status: :unprocessable_entity
    end
  end

  private

  def career_goal
    @career_goal ||=
      CareerGoal.find(params[:career_goal_id])
  end

  def goal
    @goal ||= Goal.find(params[:id])
  end

  def goal_params
    params.require(:goal).permit(
      :title,
      :due_date,
      :description
    )
  end

  def validate_access
    if career_goal.id != current_user.talent.career_goal.id
      render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end
  end
end
