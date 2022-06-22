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

  it "enqueues the job to send the email to the recepient" do
    Sidekiq::Testing.inline! do
      deliver_token_acquired_notification

      binding.pry
      job = enqueued_jobs[0]

      aggregate_failures do
        expect(job["job_class"]).to eq("Noticed::DeliveryMethods::Email")
        expect(job["arguments"][0]).to eq(staking_user.id)
      end
    end
  end
end
