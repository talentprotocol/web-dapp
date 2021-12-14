class AddUsersToMailerliteJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find user_id

    service = Mailerlite::SyncSubscriber.new

    service.call(user: user)
  end
end
