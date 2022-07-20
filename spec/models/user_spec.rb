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

  describe "#supporters" do
    let(:user) { create :user, talent: talent }
    let(:talent) { create :talent }
    let(:token) { create :token, talent: talent, deployed: true }

    context "when the user does not have any supporter" do
      it "returns an empty array" do
        expect(user.supporters).to be_empty
      end
    end

    context "when the user has some supporters" do
      let(:supporter_one) { create :user }
      let(:supporter_two) { create :user }
      let(:supporter_three) { create :user }

      before do
        create :talent_supporter, supporter_wallet_id: supporter_one.wallet_id, talent_contract_id: token.contract_id, last_time_bought_at: Date.today - 10.days
        create :talent_supporter, supporter_wallet_id: supporter_two.wallet_id, talent_contract_id: token.contract_id, last_time_bought_at: Date.today - 5.days
        create :talent_supporter, supporter_wallet_id: supporter_three.wallet_id, talent_contract_id: SecureRandom.hex, last_time_bought_at: Date.today - 2.days
        create :talent_supporter, supporter_wallet_id: user.wallet_id, talent_contract_id: token.contract_id, last_time_bought_at: Date.today
      end

      it "returns the users that support him" do
        expect(user.supporters).to match_array([user, supporter_one, supporter_two])
      end

      context "when including_self is passed as false" do
        it "returns the users that support him expect himself" do
          expect(user.supporters(including_self: false)).to match_array([supporter_one, supporter_two])
        end
      end

      context "when invested_after is passed" do
        let(:date) { Date.today - 6.days }

        it "returns the supporters that invested in the talent after that date" do
          expect(user.supporters(invested_after: date)).to match_array([supporter_two, user])
        end
      end
    end
  end

  describe "#portfolio" do
    let(:user) { create :user, wallet_id: wallet_id }
    let(:talent) { create :talent, user: user }
    let!(:token) { create :token, talent: talent }
    let(:wallet_id) { SecureRandom.hex }

    context "when the user does not have any investor" do
      it "returns an empty array" do
        expect(user.portfolio).to be_empty
      end
    end

    context "when the user does not have the wallet connected" do
      let(:wallet_id) { nil }

      it "returns an empty array" do
        expect(user.portfolio).to be_empty
      end
    end

    context "when the user has some investments" do
      let(:talent_user_one) { create :user }
      let(:talent_one) { create :talent, user: talent_user_one }
      let!(:token_one) { create :token, talent: talent_one }

      let(:talent_user_two) { create :user }
      let!(:talent_two) { create :talent, user: talent_user_two }
      let!(:token_two) { create :token, talent: talent_two }

      let(:talent_user_three) { create :user }
      let!(:talent_three) { create :talent, user: talent_user_three }
      let!(:token_three) { create :token, talent: talent_three }

      before do
        create :talent_supporter, supporter_wallet_id: wallet_id, talent_contract_id: token_one.contract_id, last_time_bought_at: Date.today - 10.days
        create :talent_supporter, supporter_wallet_id: wallet_id, talent_contract_id: token_two.contract_id, last_time_bought_at: Date.today - 5.days
        create :talent_supporter, supporter_wallet_id: SecureRandom.hex, talent_contract_id: token_three, last_time_bought_at: Date.today - 2.days
        create :talent_supporter, supporter_wallet_id: wallet_id, talent_contract_id: token.contract_id, last_time_bought_at: Date.today
      end

      it "returns the users in which the user invested" do
        expect(user.portfolio).to match_array([user, talent_user_one, talent_user_two])
      end

      context "when including_self is passed as false" do
        it "returns the users that support him expect himself" do
          expect(user.portfolio(including_self: false)).to match_array([talent_user_one, talent_user_two])
        end
      end

      context "when invested_after is passed" do
        let(:date) { Date.today - 6.days }

        it "returns the portfolio that invested in the talent after that date" do
          expect(user.portfolio(invested_after: date)).to match_array([talent_user_two, user])
        end
      end
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
