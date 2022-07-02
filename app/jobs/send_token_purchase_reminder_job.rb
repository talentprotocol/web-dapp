class SendTokenPurchaseReminderJob < ApplicationJob
  queue_as :default

  def perform
    investors = Investor
      .where("investors.created_at < ?", 7.days.ago)
      .joins(:user)
      .joins("LEFT JOIN talent_supporters ON talent_supporters.supporter_wallet_id = users.wallet_id")
      .select("investors.id, investors.user_id, COUNT(talent_supporters.id)")
      .group("investors.id, investors.user_id")
      .having("COUNT(talent_supporters.id) = 0")

    investors.each do |investor|
      UserMailer.with(user: investor.user).send_token_purchase_reminder_email.deliver_later
    end
  end
end
