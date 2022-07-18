require "rails_helper"

RSpec.describe API::UpdateTalent do
  let(:user) { create :user, :full_profile }
  subject(:update_talent) { described_class.new(user.talent, user) }

  context "when the user is approved" do
    let(:user_params) { {profile_type: "approved"} }
    let(:talent_params) { {} }
    let(:tag_params) { {} }

    it "the talent becomes public" do
      update_talent.call(user_params, talent_params, tag_params)

      expect(user.talent.public).to eq true
    end
  end
end
