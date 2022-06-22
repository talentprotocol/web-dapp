class MessageReceivedNotification < BaseNotification
  deliver_by :email, mailer: "NotificationMailer", method: :immediate, delay: 15.minutes, if: :should_deliver_immediate_email?

  def url
    messages_url
  end
end
