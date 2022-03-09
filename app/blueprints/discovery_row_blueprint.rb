class DiscoveryRowBlueprint < Blueprinter::Base
  fields :id, :title, :tag, :tag_link

  view :normal do
    association :talents, blueprint: TalentBlueprint, view: :normal
  end
end
