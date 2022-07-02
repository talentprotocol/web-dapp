class SendTokenLaunchReminderJob < ApplicationJob
  queue_as :default

  def perform
    talents = Talent
      .where("talent.created_at < ?", 10.days.ago)
      .joins(:token)
      .where(token: {deployed: false})
      .select("talent.id, talent.user_id, talent.created_at")
      .includes(:user)

    talents.each do |talent|
      UserMailer.with(user: talent.user).send_token_launch_reminder_email.deliver_later
    end
  end
end
