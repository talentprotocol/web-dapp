module ViralLoops
  class RemoveEmailFromWaitlist
    def initialize
      @url = "https://app.viral-loops.com/api/v2/flag_participants"
      @token = ENV["VIRAL_LOOPS_API_KEY"]
    end

    def call(email:)
      remove_email_from_waitlist(email)
    end

    private

    attr_reader :url, :token

    def remove_email_from_waitlist(email)
      Faraday.post(
        url,
        {apiToken: token, params: {participants: [{email: email}]}}.to_json,
        {"Content-Type": "application/json"}
      )
    end
  end
end
