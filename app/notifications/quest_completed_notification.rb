class QuestCompletedNotification < BaseNotification
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
