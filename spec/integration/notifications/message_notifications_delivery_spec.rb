require "rails_helper"

RSpec.describe "Message notifications delivery" do
  let(:sender) { create :user }
  let(:receiver) { create :user }

  subject(:send_message) do
    Messages::Send.new.call(
      sender: sender,
      receiver: receiver,
      message: "Hello!"
    )
  end

  context "when the receiver has no unread messages" do
    it "creates a new notification" do
      expect { send_message }.to change(Notification, :count).from(0).to(1)
    end

    it "enqueues a job to send the notification by email" do
      expect { send_message }.to have_enqueued_job(Noticed::DeliveryMethods::Email)
    end
  end

  context "when the receiver has unread messages from this week" do
    before do
      create(
        :notification,
        type: "MessageReceivedNotification",
        read_at: nil,
        recipient: receiver,
        created_at: Date.yesterday
      )
    end

    it "does not create a new notification" do
      expect { send_message }.not_to change(Notification, :count)
    end
  end

  context "when the receiver has unread messages created more than week ago" do
    let!(:notification) do
      create(
        :notification,
        type: "MessageReceivedNotification",
        read_at: nil,
        recipient: receiver,
        created_at: Date.today - 10.days
      )
    end

    it "creates a new notification" do
      expect { send_message }.to change(Notification, :count).from(1).to(2)
    end

    it "marks the old notification as read" do
      send_message

      expect(notification.reload.read?).to eq(true)
    end

    it "enqueues a job to send the notification by email" do
      expect { send_message }.to have_enqueued_job(Noticed::DeliveryMethods::Email)
    end
  end
end
