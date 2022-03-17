require "rails_helper"

RSpec.describe TalentSupportersRefreshJob, type: :job do
  let(:talent_contract_id) { SecureRandom.hex }

  subject(:talent_supporters_refresh) { TalentSupportersRefreshJob.perform_now(talent_contract_id) }

  let(:refresh_supporters_class) { Talents::RefreshSupporters }
  let(:refresh_supporters_service) { instance_double(refresh_supporters_class, call: true) }

  before do
    allow(refresh_supporters_class).to receive(:new).and_return(refresh_supporters_service)
  end

  it "initializes and calls the talent supporters refresh service with the correct arguments" do
    talent_supporters_refresh

    aggregate_failures do
      expect(refresh_supporters_class).to have_received(:new).with(
        talent_contract_id: talent_contract_id
      )
      expect(refresh_supporters_service).to have_received(:call)
    end
  end
end
