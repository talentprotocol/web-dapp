require "rails_helper"

RSpec.describe TriggerTalentSupportersRefreshJob, type: :job do
  let!(:deployed_tokens) { create_list :token, 3, deployed: true }
  let!(:undeployed_token) { create :token, deployed: false }

  subject(:talent_supporters_refresh) { TriggerTalentSupportersRefreshJob.perform_now }

  it "starts a job to refresh the supporters data for all talents with deployed tokens" do
    talent_supporters_refresh

    aggregate_failures do
      expect(TalentSupportersRefreshJob).not_to have_been_enqueued.with(
        undeployed_token.contract_id
      )

      deployed_tokens.each do |token|
        expect(TalentSupportersRefreshJob).to have_been_enqueued.with(
          token.contract_id
        )
      end
    end
  end
end
