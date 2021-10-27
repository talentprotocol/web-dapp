class Mailerlite::GetSubscribers
  def initialize
    @url = "https://api.mailerlite.com/api/v2/subscribers"
    @token = ENV["MAILER_LITE_API_KEY"]
  end

  def call
    response = make_request
    subscribers = JSON.parse(response.body, symbolize_names: true)
    subscribers.map { |s| Mailerlite::Subscriber.new(s) }
  end

  private

  def make_request
    Faraday.get(@url, {}, {'X-MailerLite-ApiKey': @token})
  end
end
