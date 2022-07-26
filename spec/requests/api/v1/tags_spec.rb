require "rails_helper"

RSpec.describe "Tags", type: :request do
  let(:current_user) { create :user }

  describe "#index" do
    subject(:get_tags) { get api_v1_tags_path(params: params, as: current_user) }

    let(:params) do
      {
        description: ""
      }
    end

    let!(:web3_tag) { create :tag, description: "web3" }
    let!(:founder_tag) { create :tag, description: "founder" }

    it "returns a successful response" do
      get_tags

      expect(response).to have_http_status(:ok)
    end

    context "when search params are not passed" do
      let(:params) { {} }

      it "gets all tags" do
        get_tags

        expect(json.pluck(:description)).to match_array ["web3", "founder"]
      end
    end

    context "when search params are passed" do
      let(:params) do
        {description: "web"}
      end

      it "gets tags with the param passed" do
        get_tags

        expect(json.pluck(:description)).to match_array ["web3"]
      end
    end
  end
end
