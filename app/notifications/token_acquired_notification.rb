class TokenAcquiredNotification < BaseNotification
  param "source_id"

  deliver_by :email, mailer: "NotificationMailer", method: :immediate,
                     delay: 15.minutes, if: :should_deliver_immediate_email?

  def url
    user_url(recipient.username, tab: "supporters")
  end
end
