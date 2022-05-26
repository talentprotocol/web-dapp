namespace :discovery_rows do
  task set_slug: :environment do
    # Saving the discovery row will set the slug based on the title
    DiscoveryRow.find_each { |row| row.save! }
  end
end
