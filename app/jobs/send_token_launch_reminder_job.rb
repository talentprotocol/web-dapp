class SendTokenLaunchReminderJob < ApplicationJob
  queue_as :default

  def perform(*args)
    User.joins(talent: :token)
      .where(talent: {token_launch_reminder_sent: false})
      .where(token: {contract_id: nil})
      .where("users.created_at < ?", 1.week.ago).find_each do |user|
      if user.talent.token.contract_id.nil?
        ActiveRecord::Base.transaction do
          user.talent.update!(token_launch_reminder_sent: true)
          UserMailer.with(user: user).send_token_launch_reminder_email.deliver_later
        end
      end
    end
  end
end
