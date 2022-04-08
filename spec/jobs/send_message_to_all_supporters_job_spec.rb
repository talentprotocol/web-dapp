require "rails_helper"

RSpec.describe SendMessageToAllSupportersJob, type: :job do
  let(:sender) { create :user, talent: talent }
  let(:talent) { create :talent }
  let(:token) { create :token, talent: talent }

  let(:message) { "Thanks for your support!" }

  subject(:send_message) { SendMessageToAllSupportersJob.perform_now(sender.id, message) }

  let(:send_message_class) { Messages::Send }
  let(:send_message_instance) { instance_double(send_message_class, call: created_message) }
  let(:created_message) { build :message }

  let(:investor_user_one) { create :user }
  let(:investor_user_two) { create :user }

  before do
    create :talent_supporter, supporter_wallet_id: investor_user_one.wallet_id, talent_contract_id: token.contract_id
    create :talent_supporter, supporter_wallet_id: investor_user_two.wallet_id, talent_contract_id: token.contract_id

    allow(send_message_class).to receive(:new).and_return(send_message_instance)
  end

  it "initializes and calls the send message to all supporters service" do
    send_message

    expect(send_message_class).to have_received(:new)
    expect(send_message_instance).to have_received(:call).with(
      message: message,
      sender: sender,
      receiver: investor_user_one
    )
    expect(send_message_instance).to have_received(:call).with(
      message: message,
      sender: sender,
      receiver: investor_user_two
    )
  end

  context "when the job is triggered asynchronously" do
    subject(:send_message) { SendMessageToAllSupportersJob.perform_later(sender.id, message) }

    it "queues of the job" do
      job = send_message

      expect(Sidekiq::Status.complete?(job.job_id)).to eq false
    end
  end

  context "when the user has invested in himself" do
    let(:sender) { create :user, :with_investor, talent: talent }

    before do
      create :talent_supporter, supporter_wallet_id: sender.wallet_id, talent_contract_id: token.contract_id
    end

    it "does not send a message to himself" do
      send_message

      expect(send_message_instance).not_to have_received(:call).with(
        message: message,
        sender: sender,
        receiver: sender
      )
    end
  end
end
