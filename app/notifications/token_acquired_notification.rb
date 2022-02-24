class TokenAcquiredNotification < BaseNotification
  param "source_id"

  def url
    talent_url(recipient.username, tab: "supporters")
  end
end
