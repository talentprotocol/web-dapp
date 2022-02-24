namespace :tokens do
  task update_deployed_at: :environment do
    Token.find_each do |token|
      token.update(deployed_at: token.updated_at)
    end
  end
end
