class SetupNextRaceJob < ApplicationJob
  queue_as :default

  def perform
    service = FinishActiveRace.new
    service.call
  end
end
