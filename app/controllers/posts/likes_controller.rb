class Posts::LikesController < ApplicationController
  before_action :set_post, only: [:index, :create]

  def index
    @likes_count = Like.where(post: @post).select("0").count
    @i_liked = Like.where(post: @post, user: current_user).exists?

    render json: {likes: @likes_count, i_liked: @i_liked}, status: :ok
  end

  def create
    @like = Like.new(post: @post, user: current_user)

    if @like.save
      render json: {success: "Like successfully created."}, status: :created
    else
      render json: {error: "Unable to follow."}, status: :bad_request
    end
  end

  def destroy
    @like = Like.find_by(post_id: like_params[:id], user: current_user)

    if @like.present? && @like.destroy
      render json: {success: "Like successfully removed."}, status: :ok
    else
      render json: {error: "Like does not exist."}, status: :not_found
    end
  end

  private

  def set_post
    @post = Post.find_by!(id: like_params[:post_id])
  end

  def like_params
    params.permit(:id, :post_id)
  end
end
