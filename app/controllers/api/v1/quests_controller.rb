class API::V1::QuestsController < ApplicationController
  before_action :set_quest, only: [:show]

  def show
    return if current_user.id != @quest.user_id

    render json: TaskBlueprint.render_as_json(@quest.tasks.order(:id), view: :normal), status: :ok
  end

  private

  def set_quest
    @quest = Quest.find(params[:id])
  end
end
