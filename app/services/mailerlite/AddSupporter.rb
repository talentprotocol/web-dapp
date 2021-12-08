class Mailerlite::AddSupporter
  def initialize
    @url = "https://api.mailerlite.com/api/v2/groups"
    @token = ENV["MAILER_LITE_API_KEY"]
    @supporter_group = ENV["MAILER_LITE_SUPPORTER_GROUP"]
  end

  def call(email:, name:)
    add_supporter_to_group(email, name)
  end

  private

  def add_supporter_to_group(email, name)
    Faraday.post("#{@url}/#{@supporter_group}/subscribers", {email: email, name: name}, {'X-MailerLite-ApiKey': @token})
  end
end
