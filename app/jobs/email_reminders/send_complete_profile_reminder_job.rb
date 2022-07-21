module EmailReminders
  class SendCompleteProfileReminderJob < ApplicationJob
    queue_as :default

    def perform
      users = User.joins(:talent)
        .joins(:quests)
        .where(complete_profile_reminder_sent_at: nil)
        .where("talent.created_at < ?", ENV["EMAIL_REMINDER_DAYS"].to_i.days.ago)
        .where("quests.type = ? AND status != ?", "Quests::TalentProfile", "done")

      users.find_each do |user|
        UserMailer.with(user: user).send_complete_profile_reminder_email.deliver_later
      end
    end
  end
end
