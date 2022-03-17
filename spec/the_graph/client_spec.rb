require "rails_helper"
require "the_graph/client"

RSpec.describe TheGraph::Client do
  let(:the_graph_client) { described_class.new }

  let(:api_client) { TheGraphAPI::Client }

  describe "#talent_supporters" do
    let(:talent_address) { SecureRandom.hex }

    let(:response) { instance_double(GraphQL::Client::Response, errors: errors) }
    let(:errors) { [] }

    subject(:get_talent_supporters) do
      the_graph_client.talent_supporters(params)
    end

    let(:params) { {talent_address: talent_address} }

    before do
      allow(api_client).to receive(:query).and_return(response)
    end

    it "calls the api client with the correct query and variables" do
      get_talent_supporters

      expect(api_client).to have_received(:query).with(
        TheGraph::TALENT_SUPPORTERS_QUERY,
        variables: {
          id: talent_address,
          skip: 0,
          first: 100
        }
      )
    end

    it "returns the api client response" do
      expect(get_talent_supporters).to eq response
    end

    context "when the offset variable is passed" do
      let(:params) do
        {
          talent_address: talent_address,
          offset: 100
        }
      end

      it "calls the api client with the correct query and variables" do
        get_talent_supporters

        expect(api_client).to have_received(:query).with(
          TheGraph::TALENT_SUPPORTERS_QUERY,
          variables: {
            id: talent_address,
            skip: 100,
            first: 100
          }
        )
      end
    end

    context "when the response has errors" do
      let(:errors) do
        {
          data: [
            "Unable to contact graph",
            "Graph timeout"
          ]
        }
      end

      it "raises an error with the correct error message" do
        expect { get_talent_supporters }.to raise_error(
          described_class::QueryError,
          "Unable to contact graph, Graph timeout"
        )
      end
    end
  end
end
