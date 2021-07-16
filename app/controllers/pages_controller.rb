class PagesController < ApplicationController
  def home
    if current_user.present?
      redirect_to talent_index_path
    end
  end
end
