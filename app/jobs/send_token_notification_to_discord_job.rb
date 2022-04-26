class SendTokenNotificationToDiscordJob < ApplicationJob
  queue_as :default

  include Rails.application.routes.url_helpers

  def perform(token_id)
    token = Token.find(token_id)
    talent = token.talent
    user = talent.user

    message = "_#{user.username}_ is _#{talent.profile[:occupation]}_ and just launched their Talent Token **$#{token.ticker}**. You can take a look at their profile here: #{profile_link(talent)}"
    post(message)
  end

  def post(message)
    Faraday.post(
      ENV["DISCORD_WEBHOOK_URL"].to_s,
      {
        content: message,
      }.to_json,
      {
        "Content-Type": "application/json",
      }
    )
  end

  def profile_link(talent)
    "https://beta.talentprotocol.com" + user_path(talent)
  end

end
