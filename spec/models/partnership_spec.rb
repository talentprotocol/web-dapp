require "rails_helper"

RSpec.describe Partnership, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:invite).optional }
    it { is_expected.to have_one(:discovery_row) }
  end

  describe "validations" do
    subject { build :partnership }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name) }
  end
end
