class AddUsersToMailerliteJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find user_id

    service = user.talent? ? Mailerlite::AddTalent.new : Mailerlite::AddSupporter.new

    service.call(email: user.email, name: user.username)
  end
end
