require "rails_helper"

RSpec.describe "Messages", type: :request do
  let(:user) { create :user }

  describe "#create" do
    let(:params) do
      {
        message: "Thanks for the support!",
        id: receiver.id
      }
    end

    let(:receiver) { create :user }

    let(:send_message_class) { Messages::Send }
    let(:send_message_instance) { instance_double(send_message_class, call: message_sent) }
    let(:message_sent) { build :message, sender: user, receiver: receiver }

    before do
      allow(send_message_class).to receive(:new).and_return(send_message_instance)
    end

    it "initializes and calls the send message service" do
      post messages_path(params: params, as: user)

      expect(send_message_class).to have_received(:new)
      expect(send_message_instance).to have_received(:call).with(
        message: "Thanks for the support!",
        sender: user,
        receiver: receiver
      )
    end

    it "renders a json response with the messages sent" do
      post messages_path(params: params, as: user)

      expect(json).to eq(message_sent.to_json)
    end

    context "when the message is empty" do
      let(:params) do
        {
          message: "",
          id: receiver.id
        }
      end

      it "returns a bad request response" do
        post messages_path(params: params, as: user)

        expect(response).to have_http_status(:bad_request)
        expect(json).to eq({error: "Unable to create message, either the message is empty or the sender is the same as the receiver."})
      end
    end

    context "when the message is not passed" do
      let(:params) do
        {
          id: receiver.id
        }
      end

      it "returns a bad request response" do
        post messages_path(params: params, as: user)

        expect(response).to have_http_status(:bad_request)
        expect(json).to eq({error: "Unable to create message, either the message is empty or the sender is the same as the receiver."})
      end
    end

    context "when the receiver is not passed" do
      let(:params) do
        {
          message: "Thanks for the support!"
        }
      end

      it "returns a not found response" do
        post messages_path(params: params, as: user)

        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "#send_to_all_supporters" do
    let(:params) do
      {
        message: "Thanks for the support!"
      }
    end

    let(:messages_sent) { [build(:message, sender: user)] }

    it "starts a job to send the message to all user supporters" do
      post send_to_all_supporters_messages_path(params: params, as: user)

      expect(SendMessageToAllSupportersJob).to have_been_enqueued.with(
        user.id,
        "Thanks for the support!"
      )
    end

    it "renders a json response with the messages sent" do
      send_message_job = instance_double(SendMessageToAllSupportersJob, provider_job_id: "12345")
      allow(SendMessageToAllSupportersJob).to receive(:perform_later).and_return(send_message_job)

      post send_to_all_supporters_messages_path(params: params, as: user)

      expect(json).to eq(
        {
          job_id: "12345"
        }
      )
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

  describe "#send_to_all_supporters_status" do
    let(:params) do
      {
        job_id: "123456"
      }
    end

    before do
      allow(Sidekiq::Status).to receive(:at).and_return(2)
      allow(Sidekiq::Status).to receive(:total).and_return(5)
      allow(Sidekiq::Status).to receive(:get).and_return(1)
    end

    it "renders a json response with the messages sent" do
      send_message_job = instance_double(SendMessageToAllSupportersJob, job_id: "12345")
      allow(SendMessageToAllSupportersJob).to receive(:perform_later).and_return(send_message_job)

      get send_to_all_supporters_status_messages_path(params: params, as: user)

      expect(json).to eq(
        {
          messages_sent: 2,
          messages_total: 5,
          last_receiver_id: 1
        }
      )
    end

    context "when the job id is empty" do
      let(:params) { {job_id: ""} }

      it "returns a bad request response" do
        get send_to_all_supporters_status_messages_path(params: params, as: user)

        expect(response).to have_http_status(:bad_request)
        expect(json).to eq({error: "Unable to check the status. Missing job id"})
      end
    end

    context "when params are not passed" do
      it "returns a bad request response" do
        get send_to_all_supporters_status_messages_path(as: user)

        expect(response).to have_http_status(:bad_request)
        expect(json).to eq({error: "Unable to check the status. Missing job id"})
      end
    end
  end
end
