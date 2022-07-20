require "rails_helper"

RSpec.describe EmailReminders::SendCompleteProfileReminderJob, type: :job do
  include ActiveJob::TestHelper

  let!(:user_1) { create :user, talent: talent_1 }
  let(:talent_1) { create :talent, created_at: 10.days.ago }
  let!(:quest_1) { create :quest, type: "Quests::TalentProfile", status: "pending", user: user_1 }

  let!(:user_2) { create :user, talent: talent_2 }
  let(:talent_2) { create :talent, created_at: 10.days.ago }
  let!(:quest_2) { create :quest, type: "Quests::TalentProfile", status: "done", user: user_2 }

  let!(:user_3) { create :user }

  let!(:user_4) { create :user, talent: talent_4, complete_profile_reminder_sent_at: 3.days.ago }
  let(:talent_4) { create :talent }

  let!(:user_5) { create :user, talent: talent_5, created_at: 1.days.ago }
  let(:talent_5) { create :talent }

  subject(:send_complete_profile_reminder_email) { described_class.perform_now }

  before do
    ENV["EMAIL_REMINDER_DAYS"] = "7"
  end

  it "sends the complete profile reminder only to one user" do
    Sidekiq::Testing.inline! do
      send_complete_profile_reminder_email

      perform_enqueued_jobs

      mail = ActionMailer::Base.deliveries.first

      aggregate_failures do
        expect(ActionMailer::Base.deliveries.count).to eq 1
        expect(mail.subject).to eq "Complete your profile and launch your token today 🚀"
      end
    end
  end

  it "sets the timestamp when the complete profile reminder was sent to the user" do
    freeze_time do
      send_complete_profile_reminder_email

      expect(user_1.reload.complete_profile_reminder_sent_at).to eq(Time.zone.now)
    end
  end
end
