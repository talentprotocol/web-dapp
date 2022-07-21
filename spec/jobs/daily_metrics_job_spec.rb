require "rails_helper"

RSpec.describe DailyMetricsJob, type: :job do
  let!(:user_1) { create :user, last_access_at: 5.days.ago }
  let!(:talent) { create :talent, user: user_1, updated_at: Date.today }
  let!(:token) { create :token, talent: talent, deployed: true }
  let!(:user_2) { create :user, last_access_at: Date.yesterday, investor: investor }
  let!(:investor) { create :investor, updated_at: Date.yesterday }

  let!(:user_3) { create :user }
  let!(:message) { create :message, sender: user_3, receiver: user_1, created_at: 10.days.ago }

  let!(:user_4) { create :user }
  let!(:follow) { create :follow, follower: user_4, user: user_1, created_at: 26.days.ago }

  let!(:user_5) { create :user }
  let!(:talent_supporter) { create :talent_supporter, supporter_wallet_id: user_5.wallet_id, talent_contract_id: token.contract_id, last_time_bought_at: 15.days.ago }

  let!(:user_6) { create :user }

  subject(:daily_metrics_refresh) { described_class.perform_now }

  it "creates a new daily record" do
    expect { daily_metrics_refresh }.to change(DailyMetric, :count).from(0).to(1)
  end

  it "creates a new daily record with the correct arguments" do
    daily_metrics_refresh

    created_daily_metric = DailyMetric.last

    aggregate_failures do
      expect(created_daily_metric.total_users).to eq 6
      expect(created_daily_metric.date).to eq Date.yesterday
      expect(created_daily_metric.total_talent_profiles).to eq 1
      expect(created_daily_metric.total_engaged_users).to eq 5
    end
  end
end
