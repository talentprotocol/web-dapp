require "rails_helper"

RSpec.shared_examples "a discovery row get endpoint request" do
  let!(:talent_one) { create :talent, user: create(:user) }
  let!(:talent_two) { create :talent, user: create(:user) }

  let!(:token_one) { create :token, talent: talent_one }
  let!(:token_two) { create :token, talent: talent_two }

  let(:search_talents_class) { Talents::Search }
  let(:search_talents_instance) { instance_double(Talents::Search, call: Talent.all) }

  before do
    allow(search_talents_class).to receive(:new).and_return(search_talents_instance)
  end

  context "when the discovery row passed exists" do
    let!(:discovery_row) { create :discovery_row }
    let(:slug) { discovery_row.slug }

    it "returns a successful response" do
      get_discovery_row

      expect(response).to have_http_status(:ok)
    end

    it "searches talents that belong to the discovery row" do
      get_discovery_row

      aggregate_failures do
        expect(search_talents_class).to have_received(:new)
        expect(search_talents_instance).to have_received(:call)
      end
    end

    it "assigns the correct objects to be passed to the view" do
      get_discovery_row

      expect(assigns(:discovery_row)).to eq(DiscoveryRowBlueprint.render_as_json(discovery_row, view: :normal))
      expect(assigns(:talents)).to eq(TalentBlueprint.render_as_json([talent_one, talent_two], view: :normal))
    end
  end

  context "when the discovery row passed does not exist" do
    let(:slug) { "random" }

    it "returns a not found response" do
      get_discovery_row

      expect(response).to have_http_status(:not_found)
    end
  end
end

RSpec.describe "Discovery rows", type: :request do
  describe "#show" do
    subject(:get_discovery_row) { get discovery_path(slug: slug, params: params, as: current_user) }

    let(:params) do
      {
        user: {
          keyword: "johndoe",
          status: "Launching soon"
        }
      }
    end

    context "when the current user is nil" do
      let(:current_user) { nil }

      it_behaves_like "a discovery row get endpoint request"
    end

    context "when the current user is passed" do
      let(:current_user) { create :user }

      it_behaves_like "a discovery row get endpoint request"
    end
  end
end
