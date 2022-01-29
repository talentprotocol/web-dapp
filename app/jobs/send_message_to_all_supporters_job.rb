class SendMessageToAllSupportersJob < ApplicationJob
  queue_as :default

  def perform(user_id, message)
    user = User.find(user_id)

    Messages::SendToAllSupporters.new(
      message: "Thanks for the support!",
      user: user
    ).call
  end
end
