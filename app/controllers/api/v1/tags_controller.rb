class API::V1::TagsController < ApplicationController
  def index
    tags =
      Tag
        .order(:id)
        .where(hidden: false)
        .where("description ilike ?", "%#{params[:description]}%")
        .limit(7)

    render json: TagBlueprint.render(tags), status: :ok
  end
end
