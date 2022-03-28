require "rails_helper"

RSpec.describe Talents::RefreshSupporters do
  let(:token) { create :token, talent: talent }
  let(:talent) { create :talent }
  let(:talent_contract_id) { token.contract_id }

  subject(:refresh_supporters) { described_class.new(token: token).call }

  let(:the_graph_client_class) { TheGraph::Client }
  let(:the_graph_client_instance) { instance_double(the_graph_client_class) }

  let(:talent_supporters_data) do
    OpenStruct.new(talent_token: talent_token_data)
  end

  let(:talent_token_data) do
    OpenStruct.new(
      supporter_counter: supporter_counter,
      total_supply: "70000",
      supporters: supporters_data
    )
  end

  let(:supporter_counter) { "2" }

  let(:supporters_data) do
    result = []
    supporter_counter.to_i.times do
      result << OpenStruct.new(
        id: SecureRandom.hex,
        supporter: OpenStruct.new(id: SecureRandom.hex),
        amount: "30000000000000000000",
        tal_amount: "150000000000000000000"
      )
    end
    result
  end

  before do
    allow(the_graph_client_class).to receive(:new).and_return(the_graph_client_instance)
    allow(the_graph_client_instance).to receive(:talent_supporters).and_return(talent_supporters_data)
  end

  it "initializes the graph client once" do
    refresh_supporters

    expect(the_graph_client_class).to have_received(:new).once
  end

  it "requests the talent supporters once" do
    refresh_supporters

    expect(the_graph_client_instance).to have_received(:talent_supporters).once
  end

  it "creates 2 talent supporter records" do
    expect { refresh_supporters }.to change(TalentSupporter, :count).from(0).to(2)
  end

  it "updates the talent information with the correct data" do
    refresh_supporters

    talent.reload

    aggregate_failures do
      expect(talent.total_supply).to eq "70000"
      expect(talent.supporters_count).to eq 2
    end
  end

  context "when the talent supporter records already exist in the database" do
    let(:supporters_data) do
      [
        OpenStruct.new(
          id: SecureRandom.hex,
          supporter: OpenStruct.new(id: "99asn"),
          amount: "60000000000000000000",
          tal_amount: "300000000000000000000"
        ),
        OpenStruct.new(
          id: SecureRandom.hex,
          supporter: OpenStruct.new(id: "01ksh"),
          amount: "90000000000000000000",
          tal_amount: "450000000000000000000"
        )
      ]
    end

    let!(:talent_supporter_one) { create :talent_supporter, supporter_wallet_id: "99asn", talent_contract_id: talent_contract_id }
    let!(:talent_supporter_two) { create :talent_supporter, supporter_wallet_id: "01ksh", talent_contract_id: talent_contract_id }

    it "does not create extra talent supporter records" do
      expect { refresh_supporters }.not_to change(TalentSupporter, :count)
    end

    it "updates the talent supporter records data" do
      refresh_supporters

      talent_supporter_one.reload
      talent_supporter_two.reload

      aggregate_failures do
        expect(talent_supporter_one.amount).to eq "60000000000000000000"
        expect(talent_supporter_one.tal_amount).to eq "300000000000000000000"

        expect(talent_supporter_two.amount).to eq "90000000000000000000"
        expect(talent_supporter_two.tal_amount).to eq "450000000000000000000"
      end
    end
  end

  context "when the request needs to be paginated" do
    let(:supporters_data) do
      [
        OpenStruct.new(
          id: SecureRandom.hex,
          supporter: OpenStruct.new(id: SecureRandom.hex),
          amount: "60000000000000000000",
          tal_amount: "300000000000000000000"
        )
      ]
    end

    it "initializes the graph client once" do
      refresh_supporters

      expect(the_graph_client_class).to have_received(:new).once
    end

    it "requests the talent supporters twice" do
      refresh_supporters

      expect(the_graph_client_instance).to have_received(:talent_supporters).with(
        talent_address: talent_contract_id,
        offset: 0
      )
      expect(the_graph_client_instance).to have_received(:talent_supporters).with(
        talent_address: talent_contract_id,
        offset: 1
      )
    end
  end
end
