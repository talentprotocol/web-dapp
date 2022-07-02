require "rails_helper"

RSpec.describe SendTokenPurchaseReminderJob, type: :job do
  include ActiveJob::TestHelper

  subject(:token_purchase_reminder) { SendTokenPurchaseReminderJob.perform_now }
  let(:user) { create :user }

  context "supporter created 7 days ago" do
    before do
      @investor = create :investor, created_at: 7.days.ago, user: user
    end

    it "should send email if no token is purchased" do
      Sidekiq::Testing.inline! do
        token_purchase_reminder
        perform_enqueued_jobs
        expect(ActionMailer::Base.deliveries.count).to eq 1
      end
    end

    it "should not send email if token is purchased" do
      token = create :token
      create :talent_supporter, supporter_wallet_id: @investor.wallet_id, talent_contract_id: token.contract_id

      Sidekiq::Testing.inline! do
        token_purchase_reminder
        perform_enqueued_jobs
        expect(ActionMailer::Base.deliveries.count).to eq 0
      end
    end
  end

  it "should not send email supporters created before 7 days" do
    create :investor, user: user

    Sidekiq::Testing.inline! do
      token_purchase_reminder
      perform_enqueued_jobs
      expect(ActionMailer::Base.deliveries.count).to eq 0
    end
  end
end
