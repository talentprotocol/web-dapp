namespace :user_tags do
  task talent_to_user: :environment do
    puts "starting rake task"

    UserTag.find_each do |user_tag|
      talent_id = user_tag.talent_id

      next unless talent_id

      user = Talent.find(talent_id).user
      user_tag.update(user: user)
    end

    puts "done"
  end
end
