namespace :row do
  task add_impact_market: :environment do
    tag = Tag.create(description: "impact_market_hidden", hidden: true)
    usernames = ["jessicagbt", "rosaline2104", "anaccmn", "avina", "susannezapelao", "hannahbamwerinde"]

    usernames.each do |username|
      user = User.find_by(username: username)
      TalentTag.create(talent: user.talent, tag: tag)
    end

    row = DiscoveryRow.create!(
      title: "Women of Impact",
      tag: "IMPACT MARKET",
      tag_link: "https://www.impactmarket.com/"
    )
    tag.discovery_row_id = row.id
  end
end
