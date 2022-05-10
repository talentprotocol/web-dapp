require "rails_helper"

RSpec.describe Notification, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:recipient) }
  end

  describe "#unread_for_more_than_a_week?" do
    let(:notification) { create :notification, created_at: created_at, recipient: create(:user) }
    let(:created_at) { Time.current }

    context "when the notification was created today" do
      let(:created_at) { Time.current }

      it "returns false" do
        expect(notification.unread_for_more_than_a_week?).to eq false
      end
    end

    context "when the notification was created 6 days ago" do
      let(:created_at) { Time.current - 6.days }

      it "returns false" do
        expect(notification.unread_for_more_than_a_week?).to eq false
      end
    end

    context "when the notification was created 7 days ago" do
      let(:created_at) { Time.current - 7.days }

      it "returns true" do
        expect(notification.unread_for_more_than_a_week?).to eq true
      end
    end

    context "when the notification was created 30 days ago" do
      let(:created_at) { Time.current - 30.days }

      it "returns true" do
        expect(notification.unread_for_more_than_a_week?).to eq true
      end
    end
  end
end
