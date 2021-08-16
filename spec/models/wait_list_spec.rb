require "rails_helper"

RSpec.describe WaitList, type: :model do
  describe "factories" do
    it "creates a valid wait list item" do
      wait_list = build(:wait_list)

      expect(wait_list).to be_valid
    end
  end

  describe "default values" do
    it "isn't approved or a talent by default" do
      wait_list = build(:wait_list)

      expect(wait_list.approved).to eq false
      expect(wait_list.talent).to eq false
    end
  end

  describe "validations" do
    it "does not allow wait lists with existing emails" do
      create(:wait_list, email: "test@talentprotocol.com")

      expect {
        create(:wait_list, email: "test@talentprotocol.com")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
