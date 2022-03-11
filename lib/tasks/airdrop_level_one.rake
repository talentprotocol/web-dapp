require "csv"

namespace :users do
  task airdrop_level_one: :environment do
    service = Web3::MintUserNFT.new(season: 1)
    puts "Sending to ##{User.count} users"

    CSV.open("airdrop_results.csv", "w") do |csv|
      csv << ["user_id", "username", "wallet_id", "success"]
      User.where.not(wallet_id: nil).find_each do |user|
        result = service.call(user: user)
        csv << [user.id, user.username, user.wallet_id, result.present? ? true : false]
      end
    end
  end
end
