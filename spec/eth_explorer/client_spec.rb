require "rails_helper"
require "eth_explorer/client"

RSpec.shared_examples "an unsuccesful response" do
  it "returns an not OK response" do
    expect(request).not_to be_ok
  end

  it "returns an empty result" do
    expect(request.result).to be_nil
  end
end

RSpec.describe EthExplorer::Client do
  let(:token_address) { SecureRandom.hex }

  let(:response) do
    OpenStruct.new(status: response_status, body: response_body)
  end

  let(:response_status) { 200 }
  let(:response_body) { nil }

  let(:api_key) { "test_api_key" }

  before do
    allow(Faraday).to receive(:get).and_return(response)

    ENV["ETH_EXPLORER_API_KEY"] = api_key
  end

  describe "#token_info" do
    let(:request_url) { EthExplorer::TOKEN_INFO_URL + "/#{token_address}" }
    let(:response_body) { File.read("spec/fixtures/eth_explorer/token_info.json") }

    subject(:get_token_info) do
      described_class.new.token_info(token_address: token_address)
    end

    it "makes a request to the API" do
      get_token_info

      expect(Faraday).to have_received(:get).with(
        request_url,
        {
          apiKey: api_key
        }
      )
    end

    it "returns a response get_token_info" do
      expect(get_token_info).to be_a(EthExplorer::Response)
    end

    it "returns an OK response" do
      expect(get_token_info).to be_ok
    end

    it "returns an account user in the response" do
      expect(get_token_info.result)
        .to eq(JSON.parse(response_body))
    end

    context "when the request is unsuccessful" do
      let(:response_status) { 500 }

      it_behaves_like "an unsuccesful response" do
        let(:request) { get_token_info }
      end
    end
  end

  describe "#token_holders" do
    let(:request_url) { EthExplorer::TOKEN_HOLDERS_URL + "/#{token_address}" }
    let(:response_body) { File.read("spec/fixtures/eth_explorer/token_holders.json") }

    subject(:get_token_holders) do
      described_class.new.token_holders(token_address: token_address)
    end

    it "makes a request to the API" do
      get_token_holders

      expect(Faraday).to have_received(:get).with(
        request_url,
        {
          apiKey: api_key,
          limit: 1000
        }
      )
    end

    it "returns a response get_token_holders" do
      expect(get_token_holders).to be_a(EthExplorer::Response)
    end

    it "returns an OK response" do
      expect(get_token_holders).to be_ok
    end

    it "returns an account user in the response" do
      expect(get_token_holders.result)
        .to eq(JSON.parse(response_body))
    end

    context "when the request is unsuccessful" do
      let(:response_status) { 500 }

      it_behaves_like "an unsuccesful response" do
        let(:request) { get_token_holders }
      end
    end
  end
end
