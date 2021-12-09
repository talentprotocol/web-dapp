class SendTokenPurchaseReminderJob < ApplicationJob
  queue_as :default

  def perform(*args)
    users_that_did_not_purchase_tokens.find_each do |user|
      ActiveRecord::Base.transaction do
        user.update!(token_purchase_reminder_sent: true)
        UserMailer.with(user: user).send_token_purchase_reminder_email.deliver_later
      end
    end
  end

  private

  def users_that_did_not_purchase_tokens
    User
      .where(tokens_purchased: false)
      .where(token_purchase_reminder_sent: false)
      .where("users.created_at < ?", 1.week.ago)
  end
end
