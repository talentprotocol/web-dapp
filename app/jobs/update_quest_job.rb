class UpdateQuestJob < ApplicationJob
  queue_as :default

  def perform(type:, user_id:)
    user = User.find(user_id)

    service = Quests::Update.new
    service.call(type: type, user: user)
  end
end
