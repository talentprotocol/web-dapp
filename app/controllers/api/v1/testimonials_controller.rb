class API::V1::TestimonialsController < ApplicationController
  def create
    @testimonial = Testimonial.new(testimonial_params)
    @testimonial.user = current_user

    if @testimonial.save
      render json: { id: @testimonial.id, title: @testimonial.title, description: @testimonial.description, user: { id: @testimonial.user.id, username: @testimonial.user.username, display_name: @testimonial.user.display_name, profilePictureUrl: @testimonial.user.talent&.profile_picture_url || @testimonial.user.investor&.profile_picture_url } }, status: :created
    else
      render json: {error: "Unable to create testimonial."}, status: :bad_request
    end
  end

  private

  def testimonial_params
    params.require(:testimonial).permit(
      :title,
      :description,
      :talent_id
    )
  end
end
