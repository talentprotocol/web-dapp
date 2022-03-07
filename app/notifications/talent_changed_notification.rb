class TalentChangedNotification < BaseNotification
  param "source_id"

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
