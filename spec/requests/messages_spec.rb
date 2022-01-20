require "rails_helper"

RSpec.describe "Messages", type: :request do
  let(:user) { create :user}

  describe '#send_to_all_supporters' do
    let(:params) do
      {
        message: "Thanks for the support!"
      }
    end


    context "when the message is empty" do
      let(:params) { {} }

      it "returns a bad request response" do
        post send_to_all_supporters_messages_path(params: params, as: user)

        expect(response).to have_http_status(:bad_request)
      end
    end
  end
end