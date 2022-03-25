require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it { is_expected.to have_one(:investor) }
    it { is_expected.to have_one(:talent) }

    # Chat
    it { is_expected.to have_many(:messagee) }
    it { is_expected.to have_many(:senders).through(:messagee) }
    it { is_expected.to have_many(:messaged) }
    it { is_expected.to have_many(:receivers).through(:messaged) }

    # Feed
    it { is_expected.to have_one(:feed) }
    it { is_expected.to have_many(:follows) }
    it { is_expected.to have_many(:followers).through(:follows) }
    it { is_expected.to have_many(:following) }
    it { is_expected.to have_many(:comments) }
    it { is_expected.to have_many(:posts) }
  end

  describe "uniqueness validation" do
    it "does not allow multiple users with same email" do
      create(:user, email: "john.doe@talentprotocol.com")

      expect {
        create(:user, email: "john.doe@talentprotocol.com")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it "does not allow multiple users with same username" do
      create(:user, username: "frank")

      expect {
        create(:user, username: "frank")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it "does not allow multiple users with same wallet_id" do
      create(:user, wallet_id: "1")

      expect {
        create(:user, wallet_id: "1")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it "does not allow non supported roles" do
      expect {
        create(:user, role: "Investor")
      }.to raise_error(ActiveRecord::RecordInvalid).with_message(/The role Investor isn't supported./)
    end
  end

  describe "helper methods" do
    it "shortens the wallet id for displaying" do
      user = build(:user, wallet_id: "0x123456789101234567890")

      expect(user.display_wallet_id).to eq("0x123456789...")
    end

    it "calculates the correct chat id" do
      user1 = create(:user, wallet_id: "0", username: "0")
      user2 = create(:user, wallet_id: "1", username: "1")

      expect(user1.sender_chat_id(user2)).to eq(user1.id.to_s + user2.id.to_s)
      expect(user1.receiver_chat_id(user2)).to eq(user1.id.to_s + user2.id.to_s)
    end

    it "calculates the correct last message sent between two users" do
      user1 = create(:user, wallet_id: "0", username: "0")
      user2 = create(:user, wallet_id: "1", username: "1")
      create(:message, sender: user1, receiver: user2, text: "Hello!")
      create(:message, sender: user1, receiver: user2, text: "Bye!")

      expect(user1.last_message_with(user2).text).to eq("Bye!")
    end

    it "checks if user has unread messages" do
      user1 = build(:user, email: "a@m.com")
      user2 = build(:user, email: "b@m.com")
      create(:message, sender: user1, receiver: user2, text: "Hello!",
        is_read: true)
      create(:message, sender: user2, receiver: user1, text: "Hello!",
        is_read: false)
      create(:message, sender: user2, receiver: user1, text: "Bye!", is_read:
             false)

      expect(user1.has_unread_messages?).to be_truthy
      expect(user2.has_unread_messages?).to be_falsey
    end
  end
end
