require "the_graph/client"

module Talents
  class RefreshSupporters
<<<<<<< HEAD
    def initialize(token:)
      @token = token
    end

    def call
      fetched_supporters_count = 0

      talent_supporters_response = talent_supporters(offset: fetched_supporters_count)
      supporters_count = talent_supporters_response.talent_token.supporter_counter.to_i
      total_supply = talent_supporters_response.talent_token.total_supply

      upsert_talent_info(supporters_count, total_supply)

      loop do
=======
    def initialize(talent_contract_id:)
      @talent_contract_id = talent_contract_id
    end

    def call
      fetch_talent_supporters = true
      offset = 0

      while fetch_talent_supporters
        talent_supporters_response = talent_supporters(offset: offset)
>>>>>>> 400fbe8 (Add workers to refresh talent supporters data locally)
        supporters = talent_supporters_response.talent_token.supporters

        upsert_talent_supporters(supporters)

<<<<<<< HEAD
        fetched_supporters_count += supporters.count

        break if fetched_supporters_count == talent_supporters_response.talent_token.supporter_counter.to_i

        talent_supporters_response = talent_supporters(offset: fetched_supporters_count)
=======
        fetch_talent_supporters = (offset + TheGraph::MAX_RECORDS) < talent_supporters_response.talent_token.supporter_counter.to_i
        offset += TheGraph::MAX_RECORDS
>>>>>>> 400fbe8 (Add workers to refresh talent supporters data locally)
      end
    end

    private

<<<<<<< HEAD
    attr_reader :token

    def talent_supporters(offset: 0)
      the_graph_client.talent_supporters(talent_address: token.contract_id, offset: offset)
    end

    def upsert_talent_info(supporters_count, total_supply)
      talent.update!(
        supporters_count: supporters_count,
        total_supply: total_supply
      )
    end

    def talent
      token.talent
=======
    attr_reader :talent_contract_id

    def talent_supporters(offset: 0)
      the_graph_client.talent_supporters(talent_address: talent_contract_id, offset: offset)
>>>>>>> 400fbe8 (Add workers to refresh talent supporters data locally)
    end

    def upsert_talent_supporters(supporters)
      supporters.each do |supporter|
<<<<<<< HEAD
        talent_supporter = TalentSupporter.find_or_initialize_by(
          talent_contract_id: token.contract_id,
          supporter_wallet_id: supporter.id
        )

        talent_supporter.update!(
          amount: supporter.amount,
          tal_amount: supporter.tal_amount,
          synced_at: Time.zone.now
=======
        talent_supporter = TalentSupporter.find_or_create_by!(talent_contract_id: talent_contract_id, wallet_id: supporter.id)

        talent_supporter.update!(
          amount: supporter.amount,
          tal_amount: supporter.tal_amount
>>>>>>> 400fbe8 (Add workers to refresh talent supporters data locally)
        )
      end
    end

    def the_graph_client
      @the_graph_client ||= TheGraph::Client.new
    end
  end
end
