class TagBlueprint < Blueprinter::Base
  fields :id, :description

  view :normal do
    field :user_count do |tag, _options|
      tag.user_tags.count
    end
  end
end
