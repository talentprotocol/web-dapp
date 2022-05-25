require "rails_helper"

RSpec.describe DiscoveryRow, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:tags) }
    it { is_expected.to have_many(:visible_tags) }
  end

  describe "validations" do
    subject { build :discovery_row }

    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_uniqueness_of(:title) }
    it { is_expected.to validate_uniqueness_of(:slug) }
  end

  describe "#slug" do
    let(:discovery_row) { build :discovery_row, title: "Talent Protocol Team" }

    it "generates a slug based on the title on save" do
      discovery_row.save!

      expect(discovery_row.slug).to eq "talent-protocol-team"
    end
  end
end
