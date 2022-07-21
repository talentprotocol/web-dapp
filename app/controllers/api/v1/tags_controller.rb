class API::V1::TagsController < ApplicationController
  def index
    tags =
      Tag
        .visible
        .left_joins(:user_tags)
        .order("user_tags.count DESC")
        .where("description ilike ?", "%#{params[:description]}%")
        .group(:id)
        .limit(15)

    render json: TagBlueprint.render(tags, view: :normal), status: :ok
  end
end
