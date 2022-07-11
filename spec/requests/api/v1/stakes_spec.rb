require "rails_helper"

RSpec.describe "Stakes", type: :request do
  let(:current_user) { create :user }

  describe "#create" do
    let(:talent) { create :talent }
    let!(:token) { create :token, talent: talent }
    let(:token_id) { token.id }

    let(:stakes_create_class) { Stakes::Create }
    let(:stakes_create) { instance_double(stakes_create_class, call: true) }

    subject(:create_stake_request) { post api_v1_stakes_path(params: params, as: current_user) }

    let(:params) do
      {
        stake: {
          token_id: token_id
        }
      }
    end

    before do
      allow(stakes_create_class).to receive(:new).and_return(stakes_create)
    end

    it "returns a successful response" do
      create_stake_request

      expect(response).to have_http_status(:ok)
    end

    it "returns a success messages" do
      create_stake_request

      expect(json).to eq(
        {
          success: "Stake created."
        }
      )
    end

    it "initializes and calls the create stake service" do
      create_stake_request

      aggregate_failures do
        expect(stakes_create_class).to have_received(:new).with(
          token: token,
          staking_user: current_user
        )
        expect(stakes_create).to have_received(:call)
      end
    end

    context "when the token passed does not exist" do
      let(:token_id) { -1 }

      it "returns a not found response" do
        create_stake_request

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
