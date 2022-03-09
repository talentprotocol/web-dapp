class DiscoveryRowBlueprint < Blueprinter::Base
  fields :id, :title, :badge, :badge_link

  view :normal do
    association :talents, blueprint: TalentBlueprint, view: :normal
  end
end
