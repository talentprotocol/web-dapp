class Mailerlite::GetSubscribers
  def initialize(params)
    @url = "https://api.mailerlite.com/api/v2/subscribers"
    @token = ENV["MAILER_LITE_API_KEY"]
    @page = Integer(params.fetch(:page, "1"))
  end

  def call
    response = make_request
    subscribers = JSON.parse(response.body, symbolize_names: true)
    subscribers.map { |s| Mailerlite::Subscriber.new(s) }
  end

  private

  def make_request
    url =
      if @page > 1
        "#{@url}?offset=#{(@page - 1) * 100}&limit=100"
      else
        @url.to_s
      end
    Faraday.get(url, {}, {'X-MailerLite-ApiKey': @token})
  end
end
