require "rails_helper"

RSpec.describe SendMessageToAllSupportersJob, :type => :job do
  let(:user) { create :user }
  let(:message) { "Thanks for your support!" }

  subject(:send_message) { SendMessageToAllSupportersJob.perform_now(user.id, message) }

  let(:send_to_all_supporters_class) { Messages::SendToAllSupporters }
  let(:send_to_all_supporters_instance) { instance_double(send_to_all_supporters_class, call: true) }

  before do
    allow(send_to_all_supporters_class).to receive(:new).and_return(send_to_all_supporters_instance)
  end

  it "initializes and calls the send message to all supporters service" do
    send_message

    expect(send_to_all_supporters_class).to have_received(:new).with(
      message: "Thanks for the support!",
      user: user
    )
    expect(send_to_all_supporters_instance).to have_received(:call)
  end
end