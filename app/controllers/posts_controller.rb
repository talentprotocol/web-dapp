class PostsController < ApplicationController
  def show
    @post = Post.find_by(id: post_params[:id])

    if @post.present?
      render json: @post.to_json, status: :ok
    else
      render json: {error: "Post not found."}, status: :not_found
    end
  end

  def create
    service = CreatePost.new
    @post = service.call(text: post_params[:text], writer: current_user)

    if @post.save
      render json: @post.to_json, status: :created
    else
      render json: {error: "Unable to create post."}, status: :bad_request
    end
  end

  def destroy
    @post = Post.find_by(user: post_params[:user_id], follower: current_user)

    if @post.present? && @post.destroy
      render json: {success: "Follow successfully removed."}, status: :ok
    else
      render json: {error: "Follow does not exist"}, status: :not_found
    end
  end

  private

  def post_params
    params.permit(:id, :user_id, :text)
  end
end
