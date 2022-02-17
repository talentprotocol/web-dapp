require "rails_helper"

RSpec.describe "Users", type: :request do
  let(:current_user) { create :user }

  describe "#index" do
    subject(:get_users) { get api_v1_users_path(params: params, as: current_user) }

    let(:params) do
      {
        name: "john",
        messaging_disabled: true
      }
    end

    let(:found_user_1) { create :user }
    let(:found_user_2) { create :user }
    let(:found_users) { User.where(id: [found_user_1.id, found_user_2.id]) }

    let(:search_users_class) { Users::Search }
    let(:search_users_instance) { instance_double(search_users_class, call: found_users) }

    before do
      allow(search_users_class).to receive(:new).and_return(search_users_instance)
    end

    it "returns a successful response" do
      get_users

      expect(response).to have_http_status(:ok)
    end

    context "when search params are not passed" do
      let(:params) { {} }

      before do
        create_list :user, 21
      end

      let(:found_users) { User.all }

      it "initializes and calls the search users service" do
        get_users

        aggregate_failures do
          expect(search_users_class).to have_received(:new).with(
            current_user: current_user,
            search_params: params
          )

          expect(search_users_instance).to have_received(:call)
        end
      end

      it "limits the number of users to 20" do
        get_users

        expect(json[:users].count).to eq 20
      end
    end

    context "when search params are passed" do
      let(:params) do
        {
          name: "john",
          messaging_disabled: "false"
        }
      end

      it "initializes and calls the search users service" do
        get_users

        aggregate_failures do
          expect(search_users_class).to have_received(:new).with(
            current_user: current_user,
            search_params: params.symbolize_keys
          )

          expect(search_users_instance).to have_received(:call)
        end
      end

      it "returns the users found" do
        get_users

        returned_user_ids = json[:users].map { |u| u[:id] }
        expect(returned_user_ids).to match_array(found_users.map(&:id))
      end
    end
  end

  describe "#update" do
    subject(:update_user_request) { put api_v1_user_path(id: current_user.id, params: params, as: current_user) }

    let(:params) do
      {
        user: {
          username: "johndoe",
          email: "john.doe@talent.com",
          messaging_disabled: true
        }
      }
    end

    context "when the current user does not match the user id passed" do
      let(:another_user) { create :user }

      it "returns an authorization error" do
        put api_v1_user_path(id: another_user.id, params: params, as: current_user)

        expect(response).to have_http_status(:unauthorized)
      end

      it "renders the appropriate error message" do
        put api_v1_user_path(id: another_user.id, params: params, as: current_user)

        expect(json).to eq(
          {
            error: "You don't have access to perform that action"
          }
        )
      end
    end

    context "when the params are all valid" do
      it "returns a successful response" do
        update_user_request

        expect(response).to have_http_status(:ok)
      end

      it "updates the user" do
        update_user_request

        current_user.reload

        aggregate_failures do
          expect(current_user.username).to eq "johndoe"
          expect(current_user.email).to eq "john.doe@talent.com"
          expect(current_user.messaging_disabled).to eq true
        end
      end
    end
  end
end
