require "rails_helper"

RSpec.describe TalentSupporter, type: :model do
  describe "validations" do
    subject { build :talent_supporter }

    it { is_expected.to validate_presence_of(:supporter_wallet_id) }
    it { is_expected.to validate_presence_of(:talent_contract_id) }
    it { is_expected.to validate_presence_of(:synced_at) }
    it { is_expected.to validate_uniqueness_of(:supporter_wallet_id).scoped_to(:talent_contract_id) }
  end
end
