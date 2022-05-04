class SendTokenNotificationToDiscordJob < ApplicationJob
  queue_as :default

  def perform(token_id)
    service = Talents::SendTokenNotificationToDiscord.new
    service.call(token_id)
  end
end
