class TalentSupportersRefreshJob < ApplicationJob
  queue_as :default

  def perform(talent_contract_id)
    token = Token.where(deployed: true).find_by!(contract_id: talent_contract_id)
    Talents::RefreshSupporters.new(token: token).call
  end
end
