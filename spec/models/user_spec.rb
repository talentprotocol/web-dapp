require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it { is_expected.to have_one(:investor) }
    it { is_expected.to have_one(:talent) }
    it { is_expected.to have_many(:messagee) }
    it { is_expected.to have_many(:senders).through(:messagee) }
    it { is_expected.to have_many(:messaged) }
    it { is_expected.to have_many(:receivers).through(:messaged) }
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
    end

    it "creates a valid user with external id" do
      user = build(:user, :external_log_in)

      expect(user).to be_valid
    end

    it "validates the absence of email, password or external id" do
      user = build(:user, email: nil, password: nil, wallet_id: nil)

      expect(user).not_to be_valid
    end
  end
end
