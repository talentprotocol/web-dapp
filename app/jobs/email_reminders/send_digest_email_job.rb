module EmailReminders
  class SendDigestEmailJob < ApplicationJob
    queue_as :default

    def perform
      users = User.joins(:talent)
        .where("users.digest_email_sent_at < ? OR users.digest_email_sent_at IS NULL", ENV["DIGEST_EMAIL_DAYS"].to_i.days.ago)

      unless ENV["DIGEST_EMAIL_ENABLED"] == "true"
        users = users.where(role: "admin")
      end

      users.each do |user|
        UserMailer.with(user: user).send_digest_email.deliver_later
        user.update!(digest_email_sent_at: Time.zone.now)
      end
    end
  end
end
