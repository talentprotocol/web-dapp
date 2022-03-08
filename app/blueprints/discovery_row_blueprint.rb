class DiscoveryRowBlueprint < Blueprinter::Base
  fields :id, :title

  view :normal do
    association :talents, blueprint: TalentBlueprint, view: :normal
  end
end
