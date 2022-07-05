require "rails_helper"

RSpec.describe "Impersonations", type: :request do
  let(:impersonated_user) { create :user }
  let(:cookie_jar) { ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash) }

  subject(:create_impersonation_request) { post api_v1_impersonations_path(params: {username: impersonated_user.username}, as: current_user) }

  describe "#create" do
    context "when current_user is admin" do
      let(:current_user) { create :user, role: "admin" }

      it "should start user impersonation" do
        create_impersonation_request
        aggregate_failures do
          expect(response).to have_http_status(:created)
          expect(cookie_jar.signed[:impersonated]).to eq(impersonated_user.username)
        end
      end

      it "creates a new impersonation record" do
        expect { create_impersonation_request }.to change(Impersonation, :count).from(0).to(1)
      end

      it "should be unsuccessful when user does not exist" do
        post api_v1_impersonations_path(params: {username: Faker::Name.first_name.downcase}, as: current_user)
        aggregate_failures do
          expect(response).to have_http_status(:not_found)
          expect(cookie_jar.signed[:impersonate]).to be_nil
        end
      end

      it "should expire after 30 minutes" do
        create_impersonation_request
        travel_to 30.minutes.from_now
        expect(cookie_jar.signed[:impersonate]).to be_nil
      end
    end

    context "when current_user is not admin" do
      let(:current_user) { create :user }

      it "should be unauthorized" do
        create_impersonation_request
        aggregate_failures do
          expect(response).to have_http_status(:unauthorized)
          expect(cookie_jar.signed[:impersonate]).to be_nil
        end
      end
    end
  end

  describe "#destroy" do
    subject(:delete_impersonation_request) { delete api_v1_impersonation_path(id: impersonated_user.id, as: current_user) }

    context "when user is admin" do
      let(:current_user) { create :user, role: "admin" }

      it "should destroy cookie when user is impersonated" do
        create_impersonation_request
        delete_impersonation_request
        aggregate_failures do
          expect(response).to have_http_status(:ok)
          expect(cookie_jar.signed[:impersonated]).to be_nil
        end
      end

      it "should be unauthorized if impersonation does not exist" do
        delete_impersonation_request
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when user is not admin" do
      let(:current_user) { create :user }

      it "should be unauthorized" do
        create_impersonation_request
        delete_impersonation_request
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
