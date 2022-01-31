class DropTestimonials < ActiveRecord::Migration[6.1]
  def change
    drop_table :testimonials
  end
end
