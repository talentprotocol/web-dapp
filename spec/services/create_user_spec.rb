require "rails_helper"

RSpec.describe CreateUser do
  include ActiveJob::TestHelper

  subject(:create_user) { described_class.new }

  let(:user) { create(:user, username: "jack") }

  context "when a valid invite is provided" do
    let(:invite) { create(:invite, user: user) }
    let(:user_creation_params) {
      {
        email: "francisco@talentprotocol.com",
        username: "leal",
        password: "password",
        invite_code: invite.code,
        theme_preference: "light"
      }
    }

    it "it creates a new user" do
      result = create_user.call(user_creation_params)

      expect(result[:success]).to be(true)
      expect(result[:user]).to be_persisted
    end
  end

  context "when the invite already has enough uses for the scout reward" do
    let(:invite) { create(:invite, user: user, talent_invite: true, uses: 4) }
    let(:user_creation_params) {
      {
        email: "francisco@talentprotocol.com",
        username: "leal",
        password: "password",
        invite_code: invite.code,
        theme_preference: "light"
      }
    }

    it "it enqueues the job to calculate rewards" do
      Sidekiq::Testing.inline! do
        create_user.call(user_creation_params)

        expect(enqueued_jobs.size).to eq 1
        job = enqueued_jobs[0]
        expect(job["arguments"][0]["type"]).to eq("Tasks::Register")
        expect(job["arguments"][0]["user_id"]).to eq(user.id)
      end
    end
  end
end
