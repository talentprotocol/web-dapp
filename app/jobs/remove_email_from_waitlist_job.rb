class RemoveEmailFromWaitlistJob < ApplicationJob
  queue_as :default

  def perform(email:)
    return if ENV["ENABLE_VIRAL_LOOPS_API"] != "enable"

    service = ViralLoops::RemoveEmailFromWaitlist.new
    service.call(email: email)
  end
end
