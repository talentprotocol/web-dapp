class Notion::SyncTalent
  include Rails.application.routes.url_helpers

  def initialize
    @notion_key = ENV["NOTION_API_KEY"]
    @database_id = ENV["NOTION_TALENT_DATABASE_ID"]
    @url = "https://api.notion.com/v1/pages"
    @version = "2021-08-16"
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
        "Display Name": {
          rich_text: [
            {
              text: {
                content: talent.user.display_name || ""
              }
            }
          ]
        },
        Status: {
          select: {
            name: talent.public? ? "Public" : "Private"
          }
        },
        Email: {
          email: talent.user.email || ""
        },
        Discord: {
          rich_text: [
            {
              text: {
                content: talent.discord || ""
              }
            }
          ]
        },
        Github: {
          rich_text: [
            {
              text: {
                content: talent.github || ""
              }
            }
          ]
        },
        Linkedin: {
          rich_text: [
            {
              text: {
                content: talent.linkedin || ""
              }
            }
          ]
        },
        "Profile URL": {
          url: user_path(talent, only_path: true)
        },
        Telegram: {
          rich_text: [
            {
              text: {
                content: talent.telegram || ""
              }
            }
          ]
        },
        Ticker: {
          rich_text: [
            {
              text: {
                content: talent.token.ticker || ""
              }
            }
          ]
        },
        "Token Address": {
          rich_text: [
            {
              text: {
                content: talent.token.contract_id || ""
              }
            }
          ]
        },
        Twitter: {
          rich_text: [
            {
              text: {
                content: talent.twitter || ""
              }
            }
          ]
        },
        Website: {
          rich_text: [
            {
              text: {
                content: talent.website || ""
              }
            }
          ]
        }
      }
    }.to_json
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
