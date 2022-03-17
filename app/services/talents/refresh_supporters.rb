require "the_graph/client"

module Talents
  class RefreshSupporters
    def initialize(talent_contract_id:)
      @talent_contract_id = talent_contract_id
    end

    def call
      fetched_supporters_count = 0

      loop do
        talent_supporters_response = talent_supporters(offset: fetched_supporters_count)
        supporters = talent_supporters_response.talent_token.supporters

        upsert_talent_supporters(supporters)

        fetched_supporters_count += supporters.count

        break if fetched_supporters_count == talent_supporters_response.talent_token.supporter_counter.to_i
      end
    end

    private

    attr_reader :talent_contract_id

    def talent_supporters(offset: 0)
      the_graph_client.talent_supporters(talent_address: talent_contract_id, offset: offset)
    end

    def upsert_talent_supporters(supporters)
      supporters.each do |supporter|
        talent_supporter = TalentSupporter.find_or_initialize_by(
          talent_contract_id: talent_contract_id,
          supporter_wallet_id: supporter.id
        )

        talent_supporter.update!(
          amount: supporter.amount,
          tal_amount: supporter.tal_amount,
          synced_at: Time.zone.now
        )
      end
    end

    def the_graph_client
      @the_graph_client ||= TheGraph::Client.new
    end
  end
end
