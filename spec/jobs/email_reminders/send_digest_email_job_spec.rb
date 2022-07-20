require "rails_helper"

RSpec.describe EmailReminders::SendDigestEmailJob, type: :job do
  include ActiveJob::TestHelper

  let!(:user_1) { create :user, talent: talent_1, digest_email_sent_at: 10.days.ago, role: "admin" }
  let(:talent_1) { create :talent }

  let!(:user_2) { create :user, talent: talent_2, digest_email_sent_at: 8.days.ago }
  let(:talent_2) { create :talent }

  let!(:user_3) { create :user }

  let!(:user_4) { create :user, talent: talent_4, digest_email_sent_at: 3.days.ago }
  let(:talent_4) { create :talent }

  let!(:user_5) { create :user, talent: talent_5, digest_email_sent_at: nil }
  let(:talent_5) { create :talent }

  subject(:send_digest_email) { described_class.perform_now }

  before do
    ENV["DIGEST_EMAIL_DAYS"] = "7"
  end

  context "when the digest email is enabled" do
    before do
      ENV["DIGEST_EMAIL_ENABLED"] = "true"
    end

    it "sends the complete profile reminder to three users" do
      Sidekiq::Testing.inline! do
        send_digest_email

        perform_enqueued_jobs

        mail = ActionMailer::Base.deliveries.first

        aggregate_failures do
          expect(ActionMailer::Base.deliveries.count).to eq 3
          expect(mail.subject).to eq "The latest on Talent Protocol"
        end
      end
    end

    it "sets the timestamp when the complete profile reminder was sent to the user" do
      freeze_time do
        send_digest_email

        expect(user_1.reload.digest_email_sent_at).to eq(Time.zone.now)
        expect(user_2.reload.digest_email_sent_at).to eq(Time.zone.now)
        expect(user_5.reload.digest_email_sent_at).to eq(Time.zone.now)
      end
    end
  end

  context "when the digest email is not enabled" do
    before do
      ENV["DIGEST_EMAIL_ENABLED"] = "false"
    end

    it "sends the complete profile reminder to the admin user" do
      Sidekiq::Testing.inline! do
        send_digest_email

        perform_enqueued_jobs

        mail = ActionMailer::Base.deliveries.first

        aggregate_failures do
          expect(ActionMailer::Base.deliveries.count).to eq 1
          expect(mail.subject).to eq "The latest on Talent Protocol"
        end
      end
    end

    it "sets the timestamp when the complete profile reminder was sent to the user" do
      freeze_time do
        send_digest_email

        expect(user_1.reload.digest_email_sent_at).to eq(Time.zone.now)
      end
    end
  end
end
