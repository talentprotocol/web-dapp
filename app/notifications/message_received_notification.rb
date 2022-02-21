class MessageReceivedNotification < BaseNotification
  def url
    messages_path
  end
end
