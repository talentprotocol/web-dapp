class SendMessageToAllSupportersJob < ApplicationJob
  queue_as :default
  include Sidekiq::Status::Worker

  def perform(sender_id, message)
    sender = User.find(sender_id)
    investors = investors(sender)

    total investors.count
    at 0

    investors(sender).find_each.with_index do |investor, index|
      created_message = send_message_service.call(
        message: message,
        sender: sender,
        receiver: investor.user
      )

      store last_receiver_id: created_message.receiver_id
      at index + 1
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
