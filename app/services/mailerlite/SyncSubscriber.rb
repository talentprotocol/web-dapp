class Mailerlite::SyncSubscriber
  def initialize
    @url = "https://api.mailerlite.com/api/v2/subscribers"
    @token = ENV["MAILER_LITE_API_KEY"]
  end

  def call(user)
    check_request = search_for_email_request(user)
    if check_request.status == 200
      content = JSON.parse(check_request.body)

      if content.length == 0
        add_subscriber(user)
      else
        update_subscriber(user)
      end
    else
      raise "Error syncing with mailerlite. Probably exceeded rate limit"
    end
  end

  private

  def add_subscriber(user)
    Faraday.post(@url, {email: user.email, fields: {username: user.username, account_type: account_type(user), status: status(user)}}.to_json, {"Content-Type": "application/json", 'X-MailerLite-ApiKey': @token})
  end

  def update_subscriber(user)
    Faraday.put("#{@url}/#{user.email}", {fields: {username: user.username, account_type: account_type(user), status: status(user)}}.to_json, {"Content-Type": "application/json", 'X-MailerLite-ApiKey': @token})
  end

  def search_for_email_request(user)
    Faraday.get("#{@url}/search?query=#{user.email}", {}, {'X-MailerLite-ApiKey': @token})
  end

  def account_type(user)
    user.talent? ? "Talent" : "Supporter"
  end

  def status(user)
    if user.talent? && user.talent.token.contract_id.present?
      if user.talent.public?
        "Token Live Public"
      else
        "Token Live Private"
      end
    else
      "Registered"
    end
  end
end
