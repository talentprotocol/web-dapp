class Testimonial < ApplicationRecord
  belongs_to :user
  belongs_to :talent
end
