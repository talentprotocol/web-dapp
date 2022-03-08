class TokenAcquiredNotification < BaseNotification
  param "source_id"

  def url
    user_url(recipient.username, tab: "supporters")
  end
end
