class DiscoveryRowBlueprint < Blueprinter::Base
  fields :id, :slug

  view :normal do
    fields :badge, :badge_link, :title, :description, :talents_count, :talents_total_supply

    association :visible_tags, blueprint: TagBlueprint
    association :partnership, blueprint: PartnershipBlueprint, view: :normal
  end

  view :with_talents do
    include_view :normal

    association :talents, blueprint: TalentBlueprint, view: :normal
  end
end
