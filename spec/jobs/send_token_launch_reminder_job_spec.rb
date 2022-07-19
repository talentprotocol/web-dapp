require "rails_helper"

RSpec.describe SendTokenLaunchReminderJob, type: :job do
  include ActiveJob::TestHelper

  subject(:token_launch_reminder) { SendTokenLaunchReminderJob.perform_now }
  let(:user) { create :user }

  before do
    ENV["EMAIL_REMINDER_DAYS"] = "10"
  end

  context "talent created 10 days ago" do
    let(:talent) { create :talent, created_at: 10.days.ago, user: user }

    it "should email talent who did not launch token" do
      create :token, talent: talent, deployed: false

      Sidekiq::Testing.inline! do
        token_launch_reminder
        perform_enqueued_jobs
        expect(ActionMailer::Base.deliveries.count).to eq 1
      end
    end

    it "should not email talents who have launched their token" do
      create :token, talent: talent, deployed: true

      Sidekiq::Testing.inline! do
        token_launch_reminder
        perform_enqueued_jobs
        expect(ActionMailer::Base.deliveries.count).to eq 0
      end
    end
  end

  it "should not email talents created before 10 days" do
    talent = create :talent, user: user
    create :token, talent: talent, deployed: false

    Sidekiq::Testing.inline! do
      token_launch_reminder
      perform_enqueued_jobs
      expect(ActionMailer::Base.deliveries.count).to eq 0
    end
  end
end
