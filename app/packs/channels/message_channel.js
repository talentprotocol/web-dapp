import consumer from "./consumer"

const setupChannel = (chat_id, onMessageReceived) =>
  consumer.subscriptions.create({ channel: "MessageChannel", chat_id }, {
    connected() { console.log(`Connected to ${chat_id} chat.`) },

    disconnected() { },

    received(data) {
      onMessageReceived(data);
    }
  });

export { setupChannel }
