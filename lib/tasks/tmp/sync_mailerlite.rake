namespace :tmp do
  task sync_mailerlite: :environment do
    puts "Syncing ##{User.count} users"
    User.find_each do |user|
      service = user.talent? ? Mailerlite::AddTalent.new : Mailerlite::AddSupporter.new
      service.call(email: user.email, name: user.username)
      print "."
    end
    puts "-- Done"
  end
end
