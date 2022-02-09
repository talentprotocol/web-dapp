namespace :notifications do
  task update_to_plural: :environment do
    Notification.where(type: "Notifications::MessageReceived").update_all(
      title: "New messages",
      body: "You have new messages"
    )
  end
end
