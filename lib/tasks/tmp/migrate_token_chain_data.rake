namespace :tokens do
  task add_staging_info: :environment do
    Token.update_all(chain_id: 44787)
  end
end
