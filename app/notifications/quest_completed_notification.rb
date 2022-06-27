class QuestCompletedNotification < BaseNotification
  deliver_by :email, mailer: "NotificationMailer", method: :immediate,
                     delay: 15.minutes, if: :should_deliver_immediate_email?

  def should_deliver_immediate_email?
    false
  end

  def should_deliver_digest_email?
    false
  end

  def url
    quest_url(params["model_id"]) if params["model_id"]
  end
end
