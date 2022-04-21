require "rails_helper"

RSpec.describe Message, type: :model do
  subject { build :message, receiver: build(:user), sender: build(:user) }

  describe "associations" do
    it { is_expected.to belong_to(:chat).optional }
    it { is_expected.to belong_to(:sender) }
    it { is_expected.to belong_to(:receiver) }
  end
end
