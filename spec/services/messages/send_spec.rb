require "rails_helper"

RSpec.describe Messages::Send do
  subject(:send_message) { described_class.new.call(sender: sender, receiver: receiver, message: message) }

  let(:message) { "Thanks for you support!" }
  let(:sender) { create :user }
  let(:receiver) { create :user }

  let(:create_notification_class) { CreateNotification }
  let(:create_notification_instance) { instance_double(create_notification_class, call: true) }

  let(:action_cable_server) do
    instance_double(ActionCable::Server::Base, broadcast: true)
  end

  before do
    allow(create_notification_class).to receive(:new).and_return(create_notification_instance)
    allow(ActionCable).to receive(:server).and_return(action_cable_server)
  end

  it "creates two messages" do
    expect { send_message }.to change(Message, :count).from(0).to(1)
  end

  it "returns the message sent" do
    created_message = send_message

    expect(created_message).to eq sender.messaged.first
  end

  it "initializes and calls the create notification service" do
    send_message

    expect(create_notification_class).to have_received(:new)
    expect(create_notification_instance).to have_received(:call).with(
      recipient: receiver,
      type: MessageReceivedNotification,
      extra_params: {sender_id: sender.id}
    )
  end

  it "broadcasts the created message" do
    send_message

    expect(action_cable_server).to have_received(:broadcast)
  end

  context "when the sender and receiver are the same" do
    let(:receiver) { sender }

    it "does not send a new message" do
      expect { send_message }.not_to change(Message, :count)
    end
  end
end
