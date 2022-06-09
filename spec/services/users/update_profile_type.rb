require "rails_helper"

RSpec.describe Users::UpdateProfileType do
  include ActiveJob::TestHelper

  subject(:update_profile_type) { described_class.new.call(params) }

  let(:user) { create :user }
  let(:admin) { create :user, role: "admin" }

  let(:params) {
    {
      user_id: user_id,
      new_profile_type: new_profile_type,
      who_dunnit_id: who_dunnit_id
    }
  }

  let(:user_id) { user.id }
  let(:who_dunnit_id) { nil }
  let(:new_profile_type) { "talent" }

  context "when a valid profile_type is provided" do
    it "it updates the profile_type" do
      result = update_profile_type

      expect(result.user_id).to be(user.id)
      expect(result.who_dunnit_id).to be(user.id)
      expect(result.new_profile_type).to eq(new_profile_type)
    end
  end

  context "when an invalid profile_type is provided" do
    let(:new_profile_type) { "gibberish" }

    it "it updates the profile_type" do
      expect { update_profile_type }.to raise_error(ArgumentError)
    end
  end

  context "when an admin updates the user" do
    let(:who_dunnit_id) { admin.id }

    it "it updates the profile_type" do
      result = update_profile_type

      expect(result.user_id).to be(user.id)
      expect(result.who_dunnit_id).to be(admin.id)
      expect(result.new_profile_type).to eq(new_profile_type)
    end
  end
end
