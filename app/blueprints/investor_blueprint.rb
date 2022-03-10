class InvestorBlueprint < Blueprinter::Base
  fields :id, :profile_picture_url

  view :normal do
    fields :user_id
    association :user, blueprint: UserBlueprint, view: :normal
  end

  view :extended do
    include_view :normal
    fields :banner_url, :profile
    association :user, blueprint: UserBlueprint, view: :extended
    association :tags, blueprint: TagBlueprint do |investor, options|
      options[:tags] || investor.user.tags
    end
  end
end
