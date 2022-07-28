class QuestsController < ApplicationController
  before_action :set_quest, only: [:show]

  def show
    return if current_acting_user.id != @quest.user_id

    @quest = QuestBlueprint.render_as_json(@quest, view: :normal)
  end

  private

  def set_quest
    @quest = Quest.find(params[:id])
  end
end
