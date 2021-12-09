class SendTokenLaunchReminderJob < ApplicationJob
  queue_as :default

  def perform(*args)
    users_that_did_not_deploy_token.find_each do |user|
      if user.talent.token.contract_id.nil?
        ActiveRecord::Base.transaction do
          user.talent.update!(token_launch_reminder_sent: true)
          UserMailer.with(user: user).send_token_launch_reminder_email.deliver_later
        end
      end
    end
  end

  private

  def users_that_did_not_deploy_token
    User.joins(talent: :token)
      .where(talent: {token_launch_reminder_sent: false})
      .where(token: {contract_id: nil})
      .where("users.created_at < ?", 1.week.ago)
  end
end
