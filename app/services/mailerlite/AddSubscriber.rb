class Mailerlite::AddSubscriber
  def initialize(params)
    @url = "https://api.mailerlite.com/api/v2/subscribers"
    @token = ENV["MAILER_LITE_API_KEY"]
    @email = params.fetch(:email)
    @name = params.fetch(:name)
  end

  def call
    check_request = search_for_email_request
    if check_request.status == 200
      content = JSON.parse(check_request.body)

      if content.length == 0
        add_subscriber
      end
    end
  end

  private

  def add_subscriber
    Faraday.post(@url, {email: @email, name: @name}, {'X-MailerLite-ApiKey': @token})
  end

  def search_for_email_request
    Faraday.get("#{@url}/search?query=#{@email}", {}, {'X-MailerLite-ApiKey': @token})
  end
end
