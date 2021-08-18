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
    if post_params[:text] == ""
      return render json: {error: "Text field is empty"}, status: :bad_request
    end

    @post = Post.create(text: post_params[:text], user: current_user)

    PublishPostJob.perform_later(post_id: @post.id, created_at: @post.created_at.to_s)

    if @post.save
      render json: @post.to_json, status: :created
    else
      render json: {error: "Unable to create post."}, status: :bad_request
    end
  end

  def destroy
    @post = Post.find_by(user: post_params[:user_id], follower: current_user)

    if @post.present? && @post.destroy
      render json: {success: "Post successfully destroyed."}, status: :ok
    else
      render json: {error: "Post does not exist"}, status: :not_found
    end
  end

  private

  def post_params
    params.permit(:id, :user_id, :text)
  end
end
