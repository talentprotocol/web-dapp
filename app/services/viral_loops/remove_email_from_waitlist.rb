module ViralLoops
  class RemoveEmailFromWaitlist
    def initialize
      @url = "https://app.viral-loops.com/api/v2/flag_participants"
      @token = ENV["VIRAL_LOOPS_API_KEY"]
    end

    def call(email:)
      return unless ENV["ENABLE_VIRAL_LOOPS_API"]

      remove_email_from_waitlist(email)
    end

    private

    def remove_email_from_waitlist(email)
      Faraday.post(
        @url,
        {apiToken: @token, params: {participants: [{email: email}]}}.to_json,
        {"Content-Type": "application/json"}
      )
    end
  end
end
