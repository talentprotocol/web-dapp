require "rails_helper"

RSpec.describe Talents::Search do
  subject(:search_talents) { described_class.new(filter_params: filter_params, sort_params: sort_params).call }

  let(:sort_params) { {} }

  let!(:user_1) { create :user, talent: talent_1, username: "jonas" }
  let(:talent_1) { create :talent, :with_token, public: true }
  let!(:user_2) { create :user, talent: talent_2, display_name: "Alexander" }
  let(:talent_2) { create :talent, :with_token, public: true }
  let!(:user_3) { create :user, talent: talent_3, username: "jonathan" }
  let(:talent_3) { create :talent, :with_token, public: true }
  let!(:user_4) { create :user, talent: talent_4, display_name: "Alex" }
  let(:talent_4) { create :talent, :with_token, public: true }

  let!(:private_user) { create :user, talent: private_talent, display_name: "Alexandrina" }
  let(:private_talent) { create :talent, :with_token, public: false }

  let!(:user_without_token) { create :user, talent: talent_without_token, username: "jona" }
  let(:talent_without_token) { create :talent, public: true }

  context "when filter params are empty" do
    let(:filter_params) { {} }

    it "returns all talent users" do
      expect(search_talents).to match_array([talent_1, talent_2, talent_3, talent_4])
    end
  end

  context "when the keyword filter is passed" do
    context "when it matches the user username" do
      let(:filter_params) do
        {
          keyword: "jona"
        }
      end

      it "returns all talent users with username matching the passed keyword" do
        expect(search_talents).to match_array([talent_1, talent_3])
      end
    end

    context "when it matches the user display_name" do
      let(:filter_params) do
        {
          keyword: "ale"
        }
      end

      it "returns all talent users with display_name matching the passed keyword" do
        expect(search_talents).to match_array([talent_2, talent_4])
      end
    end

    context "when it matches the user tags" do
      let(:filter_params) do
        {
          keyword: "web3"
        }
      end

      before do
        tag_1 = create :tag, description: "web3"
        tag_2 = create :tag, description: "design"
        tag_3 = create :tag, description: "development"

        user_1.tags << [tag_1, tag_3]
        user_2.tags << [tag_2]
        user_3.tags << [tag_1, tag_2]
        user_4.tags << [tag_3]
      end

      fit "returns all talent users with tags matching the passed keyword" do
        expect(search_talents).to match_array([talent_1, talent_3])
      end
    end
  end
end
