class Notion::SyncTalent
  include Rails.application.routes.url_helpers

  def initialize
    @notion_key = ENV["NOTION_API_KEY"]
    @database_id = ENV["NOTION_TALENT_DATABASE_ID"]
    @url = "https://api.notion.com/v1/pages"
    @version = "2022-02-22"
  end

  def call
    Talent.where.not(notion_page_id: nil).find_each do |talent|
      patch(talent)
    end

    Talent.where(notion_page_id: nil).find_each do |talent|
      request = post(talent)
      if request.status == 200
        content = JSON.parse(request.body)
        talent.update!(notion_page_id: content["id"])
      else
        raise request.body
      end
    end
  end

  private

  def talent_to_notion_content(talent)
    {
      parent: {database_id: @database_id},
      properties: {
        Username: {
          title: [
            {
              type: "text",
              text: {
                content: talent.user.username || ""
              }
            }
          ]
        },
        "User Status": {
          select: {
            name: talent_status(talent)
          }
        },
        "Display Name": {
          rich_text: [
            {
              text: {
                content: talent.user.display_name || ""
              }
            }
          ]
        },
        "Profile URL": {
          url: user_url(username: talent.user.username)
        },
        Email: {
          email: talent.user.email || ""
        },
        "Based in": {
          rich_text: [
            {
              text: {
                content: talent.based_in || ""
              }
            }
          ]
        },
        Ethnicity: {
          rich_text: [
            {
              text: {
                content: talent.ethnicity || ""
              }
            }
          ]
        },
        Gender: {
          rich_text: [
            {
              text: {
                content: talent.gender || ""
              }
            }
          ]
        },
        Nationality: {
          rich_text: [
            {
              text: {
                content: talent.nationality || ""
              }
            }
          ]
        },
        "Open to Job Offers": {
          checkbox: talent.open_to_job_offers
        },
        "Wallet Address": {
          rich_text: [
            {
              text: {
                content: talent.user.wallet_id || ""
              }
            }
          ]
        },
        Joined: {
          date: {
            start: talent.user&.created_at&.iso8601 || "",
            end: nil
          }
        },
        "Referred by": {
          rich_text: [
            {
              text: {
                content: talent.user&.invited&.user&.email || ""
              }
            }
          ]
        },
        "Engaged User?": {
          checkbox: engaged?(talent)
        },
        "Token Launch Date": {
          date: token_launch_date(talent)
        },
        Ticker: {
          rich_text: [
            {
              text: {
                content: talent&.token&.ticker || ""
              }
            }
          ]
        },
        "Has Perks?": {
          checkbox: talent.perks.any?
        },
        "TAL Invested": {
          number: total_tal_invested(talent)
        },
        Referrals: {
          number: users_invited_by(talent)
        },
        "Talents Invited": {
          number: talents_invited_by(talent)
        },
        "Approved by": {
          rich_text: [
            {
              text: {
                content: approved_by(talent)
              }
            }
          ]
        }
      }
    }.to_json
  end

  def engaged?(talent)
    monthago = 1.month.ago.beginning_of_day
    engaged = talent.updated_at > monthago ||
      talent.token.updated_at > monthago ||
      talent.career_goal.updated_at > monthago ||
      talent.perks.where("created_at > ? or updated_at > ?", monthago, monthago).exists? ||
      talent.milestones.where("created_at > ? or updated_at > ?", monthago, monthago).exists? ||
      talent.career_goal.goals.where("created_at > ? or updated_at > ?", monthago, monthago).exists?

    engaged && TalentSupporter.where(talent_contract_id: talent.token.contract_id).where("created_at > ?", monthago).exists?
  end

  def total_tal_invested(talent)
    TalentSupporter.where(supporter_wallet_id: talent.user.wallet_id).map { |tp| tp.tal_amount.to_i }.sum / 1000000000000000000
  end

  def talents_invited_by(talent)
    User.where(invite_id: talent.user.invites.where(talent_invite: true).pluck(:id)).count
  end

  def users_invited_by(talent)
    User.where(invite_id: talent.user.invites.pluck(:id)).count
  end

  def talent_status(talent)
    user = talent.user

    return "Profile Disabled" if talent.hide_profile || user.disabled

    if user.profile_type == "talent" && talent&.token&.contract_id.present?
      return talent.public? ? "Token Public" : "Token Private"
    end

    user.profile_type.humanize
  end

  def token_launch_date(talent)
    return {start: talent&.token&.deployed_at&.iso8601} if talent.token&.deployed_at

    nil
  end

  def approved_by(talent)
    UserProfileTypeChange.find_by(user: talent.user, new_profile_type: "approved")&.who_dunnit&.username || ""
  end

  def post(talent)
    Faraday.post(
      @url.to_s,
      talent_to_notion_content(talent),
      {
        Authorization: "Bearer #{@notion_key}",
        "Content-Type": "application/json",
        "Notion-Version": @version
      }
    )
  end

  def patch(talent)
    Faraday.patch(
      "#{@url}/#{talent.notion_page_id}",
      talent_to_notion_content(talent),
      {
        Authorization: "Bearer #{@notion_key}",
        "Content-Type": "application/json",
        "Notion-Version": @version
      }
    )
  end
end
