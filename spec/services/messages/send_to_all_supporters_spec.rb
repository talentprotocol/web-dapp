require "rails_helper"

RSpec.describe Messages::SendToAllSupporters do
  let(:user) { create :user }
  let(:message) { "Thanks for you support!" }

  subject(:send_message_to_all_supporters) { described_class.new(user: user, message: message) }

  context "when the user has no supporters" do
    it "raises an error" do
      expect { send_message_to_all_supporters.call }.to raise_error(
        described_class::UserWithoutSupporters,
        "You need to have supporters to use this functionality."
      )
    end
  end

  context "when the user has supporters" do
    let(:user) { create :user_with_talent, talent: talent }
    let(:talent) { create :talent }
    let(:token) { create :token, talent: talent }

    let(:investor_user_one) { create :investor_user }
    let(:investor_user_two) { create :investor_user }

    let(:create_notification_class) { CreateNotification }
    let(:create_notification_instance) { instance_double(create_notification_class, call: true) }

    let(:action_cable_server) do
      instance_double(ActionCable::Server::Base, broadcast: true)
    end

    before do
      create :transaction, investor: investor_user_one.investor, token: token
      create :transaction, investor: investor_user_one.investor, token: token
      create :transaction, investor: investor_user_two.investor, token: token

      allow(create_notification_class).to receive(:new).and_return(create_notification_instance)
      allow(ActionCable).to receive(:server).and_return(action_cable_server)
    end

    it "creates two messages" do
      expect { send_message_to_all_supporters.call }.to change(Message, :count).from(0).to(2)
    end

    it "returns the messages sent" do
      created_messages = send_message_to_all_supporters.call

      expect(created_messages).to match_array user.messaged
    end

    it "initializes and calls the create notification service twice" do
      send_message_to_all_supporters.call

      expect(create_notification_class).to have_received(:new)
      expect(create_notification_instance).to have_received(:call).with(
        title: "New message",
        body: "You have a new message",
        user_id: investor_user_one.id,
        type: "Notifications::MessageReceived"
      )
      expect(create_notification_instance).to have_received(:call).with(
        title: "New message",
        body: "You have a new message",
        user_id: investor_user_two.id,
        type: "Notifications::MessageReceived"
      )
    end

    it "broadcasts the created messages" do
      send_message_to_all_supporters.call

      expect(action_cable_server).to have_received(:broadcast).twice
    end
  end
end
