require "rails_helper"

RSpec.describe TokenAcquiredNotification do
  include ActiveJob::TestHelper

  subject(:deliver_token_acquired_notification) { described_class.with(params).deliver(recipient) }

  let(:params) do
    {
      "reinvestment" => reinvestment,
      "source_id" => staking_user.id
    }
  end

  let(:recipient) { create :user }
  let(:staking_user) { create :user }
  let(:reinvestment) { false }

  context "when the user is buying the token for the first time" do
    let(:reinvestment) { false }

    it "sends the new supporter email" do
      Sidekiq::Testing.inline! do
        deliver_token_acquired_notification

        perform_enqueued_jobs

        mail = ActionMailer::Base.deliveries.first

        aggregate_failures do
          expect(ActionMailer::Base.deliveries.count).to eq 1
          expect(mail.subject).to eq "You have a new supporter in Talent Protocol!"
        end
      end
    end
  end

  context "when the user is buying the token again" do
    let(:reinvestment) { true }

    it "sends the existing supporter email" do
      Sidekiq::Testing.inline! do
        deliver_token_acquired_notification

        perform_enqueued_jobs

        mail = ActionMailer::Base.deliveries.first

        aggregate_failures do
          expect(ActionMailer::Base.deliveries.count).to eq 1
          expect(mail.subject).to eq "Someone really believes in you - You have a new investment by #{staking_user.display_name}"
        end
      end
    end
  end
end
