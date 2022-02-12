require "rails_helper"

RSpec.describe "Users", type: :request do
  let(:current_user) { create :user }

  describe "#update" do
    subject(:update_user_request) { put api_v1_user_path(id: current_user.id, params: params, as: current_user) }

    let(:params) do
      {
        user: {
          username: 'johndoe',
          email: 'john.doe@talent.com',
          messaging_disabled: true
        }
      }
    end

    context 'when the current user does not match the user id passed' do
      let(:another_user) { create :user }

      it 'returns an authorization error' do
        put api_v1_user_path(id: another_user.id, params: params, as: current_user)

        expect(response).to have_http_status(:unauthorized)
      end

      it 'renders the appropriate error message' do
        put api_v1_user_path(id: another_user.id, params: params, as: current_user)

        expect(json).to eq(
          {
            error: "You don't have access to perform that action"
          }
        )
      end
    end

    context 'when the params are all valid' do
      it 'returns a successful response' do
        update_user_request
  
        expect(response).to have_http_status(:ok)
      end

      it 'updates the user' do
        update_user_request

        current_user.reload

        aggregate_failures do
          expect(current_user.username).to eq 'johndoe'
          expect(current_user.email).to eq 'john.doe@talent.com'
          expect(current_user.messaging_disabled).to eq true
        end
      end
    end
  end
end