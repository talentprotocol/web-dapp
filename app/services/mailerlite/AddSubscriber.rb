class Mailerlite::AddSubscriber
  include Rails.application.routes.url_helpers

  def initialize
    @url = "https://api.mailerlite.com/api/v2/subscribers"
    @token = ENV["MAILER_LITE_API_KEY"]
  end

  def call(email, name, code, talent)
    check_request = search_for_email_request(email)
    if check_request.status == 200
      content = JSON.parse(check_request.body)

      if content.length == 0
        add_subscriber(email, name, code, talent)
      else
        update_subscriber(email, name, code, talent)
      end
    end
  end

  private

  def add_subscriber(email, name, code, talent)
    Faraday.post(@url, {email: email, name: name, fields: {account_type: talent ? "Talent" : "Supporter", status: "Invited", invite_link: invite_link(code)}}.to_json, {"Content-Type": "application/json", 'X-MailerLite-ApiKey': @token})
  end

  def update_subscriber(email, name, code, talent)
    Faraday.put("#{@url}/#{email}", {name: name, fields: {account_type: talent ? "Talent" : "Supporter", status: "Invited", invite_link: invite_link(code)}}.to_json, {"Content-Type": "application/json", 'X-MailerLite-ApiKey': @token})
  end

  def search_for_email_request(email)
    Faraday.get("#{@url}/search?query=#{email}", {}, {'X-MailerLite-ApiKey': @token})
  end

  def invite_link(code)
    "https://beta.talentprotocol.com" + sign_up_path(code: code)
  end
end
