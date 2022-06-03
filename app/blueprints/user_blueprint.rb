class UserBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :username, :display_name
    field :name do |user, _options|
      user.display_name || user.username
    end
    field :is_talent do |user, _options|
      user.talent.present?
    end
    field :investor_id do |user, _options|
      user.investor&.id
    end
  end

  view :extended do
    include_view :normal
    fields :email, :wallet_id, :profile_type, :admin?
  end

  view :with_pictures do
    include_view :normal
    field :profilePictureUrl do |user, _options|
      user.talent&.profile_picture_url || user.investor.profile_picture_url
    end
  end
end
