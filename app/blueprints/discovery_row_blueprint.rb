class DiscoveryRowBlueprint < Blueprinter::Base
  fields :id, :badge, :badge_link, :slug, :title, :description, :logo_url, :talents_count

  view :normal do
    association :talents, blueprint: TalentBlueprint, view: :normal
  end
end
