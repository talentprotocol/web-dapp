class TokenAcquiredNotification < BaseNotification
  param "source_id"

  def url
    talent_path(recipient.username, tab: "supporters")
  end
end
