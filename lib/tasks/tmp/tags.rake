namespace :tags do
  task populate: :environment do
    available_tags_main = ["EdTech", "eCommerce", "Mobility", "Space", "Healthcare", "Entertainment", "Logistics"]
    available_tags_secondary = ["Entrepreneur", "NGO", "Founder", "Under 30"]

    puts "starting migration"

    Talent.all.find_each do |talent|
      Tag.create(talent: talent, description: available_tags_main.sample, primary: true)
      Tag.create(talent: talent, description: available_tags_secondary.sample)
    end

    puts "done.."
  end
end
