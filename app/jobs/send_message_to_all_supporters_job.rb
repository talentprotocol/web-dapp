class SendMessageToAllSupportersJob < ApplicationJob
  queue_as :default

  def perform(sender_id, message)
    sender = User.find(sender_id)

    investors(sender).find_each do |investor|
      send_message_service.call(
        message: message,
        sender: sender,
        receiver: investor.user
      )
    end
  end

  private

  def investors(sender)
    return [] unless sender.talent

    sender.talent.investors.where.not(user: sender).distinct.includes(:user)
  end

  def send_message_service
    @send_message_service ||= Messages::Send.new
  end
end
