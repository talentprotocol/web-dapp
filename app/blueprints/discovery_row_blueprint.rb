class DiscoveryRowBlueprint < Blueprinter::Base
  fields :id, :slug

  view :normal do
    fields :badge, :badge_link, :title, :description, :logo_url, :talents_count

    association :visible_tags, blueprint: TagBlueprint
  end

  view :with_talents do
    include_view :normal

    association :talents, blueprint: TalentBlueprint, view: :normal
  end
end
