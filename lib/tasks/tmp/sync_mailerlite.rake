namespace :tmp do
  task sync_mailerlite: :environment do
    puts "Syncing ##{User.count} users"
    service = Mailerlite::SyncSubscriber.new
    User.find_each do |user|
      service.call(user)
      print "."
      sleep 5
    end
    puts "-- Done"
  end
end
