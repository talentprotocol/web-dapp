namespace :user_profile_type_changes do
  task delete_incorrect_records: :environment do
    ids = []
    UserProfileTypeChange.all.each do |change|
      ids << change.id if change.previous_profile_type == change.new_profile_type
    end

    UserProfileTypeChange.where(id: ids).destroy_all
  end
end
