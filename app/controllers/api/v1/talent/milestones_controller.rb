class API::V1::Talent::MilestonesController < ApplicationController
  before_action :validate_access
  after_action :notify_of_change

  def update
    milestone.assign_attributes(milestone_params)
    parsed_date = milestone_params[:start_date].split("-").map(&:to_i)
    milestone.start_date = Date.new(parsed_date[0], parsed_date[1])

    if milestone.save
      render json: milestone, status: :ok
    else
      render json: {error: "Unable to update milestone"}, status: :unprocessable_entity
    end
  end

  def create
    @milestone = Milestone.new(milestone_params)

    parsed_date = milestone_params[:start_date].split("-").map(&:to_i)
    @milestone.start_date = Date.new(parsed_date[0], parsed_date[1])
    @milestone.talent = talent

    if @milestone.save
      UpdateTasksJob.perform_later(type: "Tasks::Highlights", user_id: current_user.id) if talent.milestones.length == 1
      render json: @milestone, status: :created
    else
      render json: {error: "Unable to create milestone"}, status: :unprocessable_entity
    end
  end

  def destroy
    if milestone.destroy
      render json: milestone, status: :ok
    else
      render json: {error: "Unable to delete requested milestone."}, status: :unprocessable_entity
    end
  end

  private

  def notify_of_change
    CreateNotificationTalentChangedJob.perform_later(talent.user.followers.pluck(:follower_id), talent.user_id)
  end

  def talent
    @talent ||=
      if talent_id_param
        Talent.find(params[:talent_id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def milestone
    @milestone ||= Milestone.find(params[:id])
  end

  def milestone_params
    params.require(:milestone).permit(
      :title,
      :start_date,
      :institution,
      :description,
      :link
    )
  end

  def validate_access
    if !current_user.admin? && talent.id != current_acting_user.talent&.id
      render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end
  end
end
