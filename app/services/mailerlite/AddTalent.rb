class Mailerlite::AddTalent
  def initialize
    @url = "https://api.mailerlite.com/api/v2/groups"
    @token = ENV["MAILER_LITE_API_KEY"]
    @talent_group = ENV["MAILER_LITE_TALENT_GROUP"]
  end

  def call(email:, name:)
    add_talent_to_group(email, name)
  end

  private

  def add_talent_to_group(email, name)
    Faraday.post("#{@url}/#{@talent_group}/subscribers", {email: email, name: name}, {'X-MailerLite-ApiKey': @token})
  end
end
