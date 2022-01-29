require "rails_helper"

RSpec.describe "Messages", type: :request do
  let(:user) { create :user }

  describe "#send_to_all_supporters" do
    let(:params) do
      {
        message: "Thanks for the support!"
      }
    end

    let(:send_to_all_supporters_class) { Messages::SendToAllSupporters }
    let(:send_to_all_supporters_instance) { instance_double(send_to_all_supporters_class, call: messages_sent) }
    let(:messages_sent) { [build(:message, sender: user)] }

    before do
      allow(send_to_all_supporters_class).to receive(:new).and_return(send_to_all_supporters_instance)
    end

    it "starts a job to send the message to all user supporters" do
      post send_to_all_supporters_messages_path(params: params, as: user)
      
      expect(SendMessageToAllSupportersJob).to have_been_enqueued.with(
        user_id: user.id,
        message: "Thanks for the support!"
      )
    end

    it 'renders a json response with the messages sent' do
      post send_to_all_supporters_messages_path(params: params, as: user)

      expect(json).to eq(JSON.parse(messages_sent.to_json, symbolize_names: true))
    end

    context "when the send message to all supporters service raises an error" do
      before do
        allow(send_to_all_supporters_instance).to receive(:call).and_raise(
          send_to_all_supporters_class::UserWithoutSupporters,
          "You need to have supporters to use this functionality."
        )
      end

      it "returns a bad request response" do
        post send_to_all_supporters_messages_path(params: params, as: user)

        expect(response).to have_http_status(:bad_request)
        expect(json).to eq({error: "You need to have supporters to use this functionality."})
      end
    end

    context "when the message is empty" do
      let(:params) { {message: ""} }

      it "returns a bad request response" do
        post send_to_all_supporters_messages_path(params: params, as: user)

        expect(response).to have_http_status(:bad_request)
        expect(json).to eq({error: "Unable to create message, the message is empty."})
      end
    end

    context "when params are not passed" do
      it "returns a bad request response" do
        post send_to_all_supporters_messages_path(as: user)

        expect(response).to have_http_status(:bad_request)
        expect(json).to eq({error: "Unable to create message, the message is empty."})
      end
    end
  end
end
