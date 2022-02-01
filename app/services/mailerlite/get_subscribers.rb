class Mailerlite::GetSubscribers
  def initialize(params)
    @url = "https://api.mailerlite.com/api/v2/subscribers"
    @token = ENV["MAILER_LITE_API_KEY"]
    @page = Integer(params.fetch(:page, "1") || "1")
    @search = params.fetch(:search, "")
  end

  def call
    response = make_request
    subscribers = JSON.parse(response.body, symbolize_names: true)
    subscribers.map { |s| Mailerlite::Subscriber.new(s) }
  end

  private

  def make_request
    url =
      if @search.blank?
        "#{@url}?offset=#{(@page - 1) * 100}&limit=100"
      else
        "#{@url}/search?query=#{@search}&offset=#{(@page - 1) * 100}&limit=100"
      end

    Faraday.get(url, {}, {'X-MailerLite-ApiKey': @token})
  end
end
