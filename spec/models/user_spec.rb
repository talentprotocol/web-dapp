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

  describe "factories" do
    it "creates a valid admin user" do
      user = build(:admin_user)

      expect(user).to be_valid
      expect(user).to be_admin
    end

    it "creates a valid user" do
      user = build(:user)

      expect(user).to be_valid
      expect(user).not_to be_admin
    end

    it "creates a valid user with external id" do
      user = build(:user, :metamask_login)

      expect(user).to be_valid
    end

    it "validates the absence of email, password or external id" do
      user = build(:user, email: nil, password: nil, wallet_id: nil)

      expect(user).not_to be_valid
    end
  end

  describe "uniqueness validation" do
    it "allows multiple users with no email" do
      user1 = create(:user, :metamask_login, email: nil, username: "Frankie", wallet_id: "1")
      user2 = create(:user, :metamask_login, email: nil, username: "Frank", wallet_id: "0")

      expect(user1.persisted? && user2.persisted?).to be true
    end

    it "does not allow multiple users with email \"\"" do
      create(:user, :metamask_login, email: "")

      expect {
        create(:user, :metamask_login, email: "")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it "does not allow multiple users with same username" do
      create(:user, :metamask_login, username: "Frank")

      expect {
        create(:user, :metamask_login, username: "Frank")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it "does not allow multiple users with same wallet_id" do
      create(:user, :metamask_login, wallet_id: "1")

      expect {
        create(:user, :metamask_login, wallet_id: "1")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it "does not allow non supported roles" do
      expect {
        create(:user, role: "Investor")
      }.to raise_error(ActiveRecord::RecordInvalid).with_message(/The role something else isn't supported./)
    end
  end

  describe "helper methods" do
    it "uses username as the display name" do
      user = build(:user, username: "Frank")

      expect(user.display_name).to eq("Frank")
    end

    it "uses email as the display name if no username exists" do
      user = build(:user, username: nil, email: "test@talentprotocol.com")

      expect(user.display_name).to eq("test@talentprotocol.com")
    end

    it "shortens the wallet id for displaying" do
      user = build(:user, wallet_id: "0x123456789101234567890")

      expect(user.display_wallet_id).to eq("0x123456789..")
    end

    it "calculates the correct chat id" do
      user1 = create(:user, :metamask_login, wallet_id: "0", username: "0")
      user2 = create(:user, :metamask_login, wallet_id: "1", username: "1")

      expect(user1.sender_chat_id(user2)).to eq(user1.id.to_s + user2.id.to_s)
      expect(user1.receiver_chat_id(user2)).to eq(user1.id.to_s + user2.id.to_s)
    end

    it "calculates the correct last message sent between two users" do
      user1 = create(:user, :metamask_login, wallet_id: "0", username: "0")
      user2 = create(:user, :metamask_login, wallet_id: "1", username: "1")
      create(:message, sender: user1, receiver: user2, text: "Hello!")
      create(:message, sender: user1, receiver: user2, text: "Bye!")

      expect(user1.last_message_with(user2).text).to eq("Bye!")
    end
  end
end
