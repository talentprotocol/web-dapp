require "rails_helper"

RSpec.describe Tag, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:discovery_row).optional }
    it { is_expected.to have_many(:user_tags) }
    it { is_expected.to have_many(:talents).through(:user_tags) }
  end

  describe "validations" do
    subject { build :tag }

    it { is_expected.to validate_presence_of(:description) }
  end

  describe "#to_s" do
    let(:tag) { build :tag, description: "Web3" }

    it "returns the tag description" do
      expect(tag.to_s).to eq tag.description
    end
  end
end
