class UserBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :username
    field :name do |user, _options|
      user.display_name || user.username
    end
  end

  view :extended do
    include_view :normal
    fields :email, :wallet_id
  end
end
