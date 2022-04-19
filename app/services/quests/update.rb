module Quests
  class Update
    def call(type:, user:, create_notif: true)
      task = Task.joins(:quest).where(type: type).where(quest: {user: user}).take
      return if task.done?

      update_model(model: task)
      return unless task.quest.tasks.where.not(status: "done").count == 0

      update_model(model: task.quest)
      create_notification(user: user, quest_id: task.quest_id) if create_notif
    end

    private

    def update_model(model:)
      model.update(status: "done")
    end

    def create_notification(user:, quest_id:)
      CreateNotification.new.call(
        recipient: user,
        type: QuestCompletedNotification,
        source_id: user.id,
        model_id: quest_id
      )
    end
  end
end
