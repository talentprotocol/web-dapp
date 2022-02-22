class UserBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    field :username
    field :name do |user, _options|
      user.display_name || user.username
    end
  end
end
