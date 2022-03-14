namespace :user_tags do
  task talent_to_user: :environment do
    puts "starting rake task"

    UserTag.includes(:talent).find_each do |user_tag|
      user = user_tag.talent.user
      user_tag.update(user: user)
    end

    puts "done"
  end
end
