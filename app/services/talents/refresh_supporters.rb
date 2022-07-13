require "the_graph/client"

module Talents
  class RefreshSupporters
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
        supporters = talent_supporters_response.talent_token.supporters

        upsert_talent_supporters(supporters)

        fetched_supporters_count += supporters.count

        break if fetched_supporters_count == talent_supporters_response.talent_token.supporter_counter.to_i

        talent_supporters_response = talent_supporters(offset: fetched_supporters_count)
      end
    end

    private

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
    end

    def upsert_talent_supporters(supporters)
      supporters.each do |supporter|
        talent_supporter = TalentSupporter.find_or_initialize_by(
          talent_contract_id: token.contract_id,
          supporter_wallet_id: supporter.supporter.id
        )

        current_time = Time.zone.now

        update_params = {
          amount: supporter.amount,
          tal_amount: supporter.tal_amount,
          synced_at: current_time
        }

        new_investment = talent_supporter.tal_amount != supporter.tal_amount

        update_params[:last_investment_at] = current_time if new_investment

        talent_supporter.update!(update_params)
      end
    end

    def the_graph_client
      @the_graph_client ||= TheGraph::Client.new
    end
  end
end
