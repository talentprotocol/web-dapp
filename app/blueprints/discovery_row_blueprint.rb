class DiscoveryRowBlueprint < Blueprinter::Base
  fields :id, :badge, :badge_link, :slug, :title

  view :normal do
    association :talents, blueprint: TalentBlueprint, view: :normal
  end
end
