module Tasks
  class Update
    def call(type:, user:, normal_update: true)
      ActiveRecord::Base.transaction do
        task = Task.joins(:quest).where(type: type).where(quest: {user: user}).take
        task.with_lock do
          next if task.done?

          update_model(model: task, status: "done")
          update_model(model: task.quest, status: "doing")
          give_rewards(type: type, user: user) if normal_update
          next unless task.quest.tasks.where.not(status: "done").count == 0

          update_model(model: task.quest, status: "done")
          create_notification(user: user, quest_id: task.quest_id) if normal_update
        end
      end
    end

    private

    def update_model(model:, status:)
      model.update(status: status)
    end

    def give_rewards(type:, user:)
      if type == "Tasks::Watchlist"
        user.invites.where(talent_invite: false).update_all(max_uses: nil)
      elsif type == "Tasks::ShareProfile" && user.talent
        service = CreateInvite.new(user_id: user.id, single_use: true, talent_invite: true)
        service.call
      end
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
