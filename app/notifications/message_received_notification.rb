class MessageReceivedNotification < BaseNotification
  deliver_by :email, mailer: "UserMailer", method: :send_message_received_email, delay: 15.minutes, if: :should_deliver_immediate_email?

  def url
    messages_url
  end
end
