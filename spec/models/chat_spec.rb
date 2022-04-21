require "rails_helper"

RSpec.describe Chat, type: :model do
  subject { build :chat, receiver: build(:user), sender: build(:user) }

  describe "associations" do
    it { is_expected.to belong_to(:sender) }
    it { is_expected.to belong_to(:receiver) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:sender_id) }
    it { is_expected.to validate_presence_of(:receiver_id) }
    it { is_expected.to validate_presence_of(:last_message_at) }
    it { is_expected.to validate_uniqueness_of(:sender_id).scoped_to(:receiver_id) }
  end
end
