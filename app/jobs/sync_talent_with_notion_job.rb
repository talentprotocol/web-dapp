class SyncTalentWithNotionJob < ApplicationJob
  queue_as :default

  def perform(*args)
    service = Notion::SyncTalent.new
    service.call
  end
end
