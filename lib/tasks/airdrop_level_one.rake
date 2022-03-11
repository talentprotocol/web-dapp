namespace :users do
  task airdrop_level_one: :environment do
    service = Web3::MintUserNFT.new(season: 1)
    puts "Sending to ##{User.count} users"

    User.where.not(wallet_id: nil).find_each do |user|
      service.call(user: user)
    end
  end
end
