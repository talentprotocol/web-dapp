class UpdateQuestJob < ApplicationJob
  queue_as :default

  def perform(title:, user_id:)
    user = User.find(user_id)

    service = Quests::Update.new
    service.call(title: title, user: user)
  end
end
