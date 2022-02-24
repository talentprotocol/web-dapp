class TalentBlueprint < Blueprinter::Base
  fields :id, :profile_picture_url

  view :normal do
    fields :occupation, :headline, :user_id
    association :token, blueprint: TokenBlueprint
    association :user, blueprint: UserBlueprint, view: :normal

    field :is_following do |talent, options|
      options[:current_user].following.where(user_id: talent.user_id).exists?
    end
  end
end
