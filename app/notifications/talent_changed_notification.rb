class TalentChangedNotification < BaseNotification
  param "source_id"

  deliver_by :email, mailer: "NotificationMailer", method: :immediate,
                     delay: 15.minutes, if: :should_deliver_immediate_email?

  def should_deliver_immediate_email?
    false
  end

  def should_deliver_digest_email?
    false
  end

  def url
    user_url(source.username) if source.present?
  end
end
