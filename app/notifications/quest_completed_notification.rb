class QuestCompletedNotification < BaseNotification
  def should_deliver_immediate_email?
    false
  end

  def should_deliver_digest_email?
    false
  end

  def url
    earn_url(tab: "quests", quest: params["model_id"])
  end
end
