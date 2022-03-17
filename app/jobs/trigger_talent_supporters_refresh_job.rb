class TriggerTalentSupportersRefreshJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Token.where(deployed: true).find_each do |token|
      TalentSupportersRefreshJob.perform_later(token.contract_id)
    end
  end
end
