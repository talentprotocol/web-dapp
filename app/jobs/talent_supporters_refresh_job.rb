class TalentSupportersRefreshJob < ApplicationJob
  queue_as :default

  def perform(talent_contract_id)
    Talents::RefreshSupporters.new(talent_contract_id: talent_contract_id).call
  end
end
