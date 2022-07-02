require "rails_helper"

RSpec.describe Stakes::Create do
  include ActiveJob::TestHelper

  subject(:create_stake) { described_class.new(token: token, staking_user: staking_user).call }

  let(:token) { create :token }
  let(:staking_user) { create :user }

  let(:create_notification_class) { CreateNotification }
  let(:create_notification_instance) { instance_double(create_notification_class, call: true) }

  before do
    allow(create_notification_class).to receive(:new).and_return(create_notification_instance)
  end

  context "when the user is buying tokens for the first time" do
    let(:staking_user) { create :user, tokens_purchased: false }

    it "sets the purchased tokens flag to true" do
      expect { create_stake }.to change(staking_user, :tokens_purchased).from(false).to(true)
    end

    it "enqueues the job to refresh supporters" do
      Sidekiq::Testing.inline! do
        create_stake

        job = enqueued_jobs[0]

        aggregate_failures do
          expect(job["job_class"]).to eq("AddUsersToMailerliteJob")
          expect(job["arguments"][0]).to eq(staking_user.id)
        end
      end
    end

    it "enqueues the job to send the member NFT" do
      Sidekiq::Testing.inline! do
        create_stake

        job = enqueued_jobs[1]

        aggregate_failures do
          expect(job["job_class"]).to eq("SendMemberNFTToUserJob")
          expect(job["arguments"][0]["user_id"]).to eq(staking_user.id)
        end
      end
    end

    it "enqueues the job to update the user tasks" do
      Sidekiq::Testing.inline! do
        create_stake

        job = enqueued_jobs[2]

        aggregate_failures do
          expect(job["job_class"]).to eq("UpdateTasksJob")
          expect(job["arguments"][0]["type"]).to eq("Tasks::BuyTalentToken")
          expect(job["arguments"][0]["user_id"]).to eq(staking_user.id)
        end
      end
    end
  end

  context "when the user is buying a token from another user" do
    it "initializes and calls the notification service" do
      create_stake

      aggregate_failures do
        expect(create_notification_class).to have_received(:new)
        expect(create_notification_instance).to have_received(:call).with(
          recipient: token.talent.user,
          type: TokenAcquiredNotification,
          source_id: staking_user.id,
          extra_params: {}
        )
      end
    end

    context "when the user is buying the token for a second time" do
      before do
        create :talent_supporter, talent_contract_id: token.contract_id, supporter_wallet_id: staking_user.wallet_id
      end

      it "initializes and calls the notification service with extra params" do
        create_stake

        aggregate_failures do
          expect(create_notification_class).to have_received(:new)
          expect(create_notification_instance).to have_received(:call).with(
            recipient: token.talent.user,
            type: TokenAcquiredNotification,
            source_id: staking_user.id,
            extra_params: {reinvestment: true}
          )
        end
      end
    end
  end

  context "when the user is buying his own token" do
    let(:token) { create :token, talent: talent }
    let(:talent) { create :talent, user: staking_user }
    let(:staking_user) { create :user }

    it "does not call the notification service" do
      create_stake

      expect(create_notification_class).not_to have_received(:new)
    end

    it "enqueues the job to refresh supporters" do
      Sidekiq::Testing.inline! do
        create_stake

        job = enqueued_jobs.last

        aggregate_failures do
          expect(job["job_class"]).to eq("TalentSupportersRefreshJob")
          expect(job["arguments"][0]).to eq(token.contract_id)
        end
      end
    end

    context "when the user already bought tokens" do
      let(:staking_user) { create :user, tokens_purchased: true }

      it "only triggers the job to refresh the supporters" do
        Sidekiq::Testing.inline! do
          create_stake

          aggregate_failures do
            expect(enqueued_jobs.count).to eq 1
            expect(enqueued_jobs.pluck("job_class")).to eq(["TalentSupportersRefreshJob"])
          end
        end
      end
    end
  end

  context "when the user is buying"
end
