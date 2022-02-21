class CreateNotificationTalentChangedJob < ApplicationJob
  queue_as :default

  def perform(users_ids, source_id)
    users_ids = users_ids.filter { |id| id != source_id }

    User.where(id: users_ids).find_each do |user|
      CreateNotification.call(recipient: user,
                              type: TalentChangedNotification,
                              source_id: source_id)
    end
  end
end
