require "rails_helper"

RSpec.describe "Chats", type: :request do
  let(:current_user) { create :user }

  describe "#index" do
    let(:params) { {} }

    let(:user_1) { create :user }
    let(:user_2) { create :user }
    let(:user_3) { create :user }

    let!(:chat_1) { create :chat, sender: current_user, receiver: user_1, last_message_at: 7.days.ago }
    let!(:chat_2) { create :chat, sender: user_2, receiver: current_user, last_message_at: 3.days.ago }
    let!(:chat_3) { create :chat, sender: current_user, receiver: user_3, last_message_at: 10.days.ago }

    subject(:get_chats) { get chats_path(params: params, as: current_user) }

    it "returns a successful response" do
      get_chats

      expect(response).to have_http_status(:ok)
    end

    it "returns a list of chats sorted by the last message at field" do
      get_chats

      expect(assigns(:chats)).to eq [
        {
          "id" => chat_2.id,
          "last_message_at" => chat_2.last_message_at.iso8601,
          "last_message_text" => chat_2.last_message_text,
          "receiver_id" => user_2.id,
          "receiver_last_online" => user_2.last_access_at&.iso8601,
          "receiver_messaging_disabled" => user_2.messaging_disabled,
          "receiver_profile_picture_url" => user_2.profile_picture_url,
          "receiver_ticker" => user_2.talent&.token&.ticker,
          "receiver_username" => user_2.username,
          "receiver_with_talent" => user_2.talent.present?,
          "unread_messages_count" => chat_2.sender_unread_messages_count
        },
        {
          "id" => chat_1.id,
          "last_message_at" => chat_1.last_message_at.iso8601,
          "last_message_text" => chat_1.last_message_text,
          "receiver_id" => user_1.id,
          "receiver_last_online" => user_1.last_access_at&.iso8601,
          "receiver_messaging_disabled" => user_1.messaging_disabled,
          "receiver_profile_picture_url" => user_1.profile_picture_url,
          "receiver_ticker" => user_1.talent&.token&.ticker,
          "receiver_username" => user_1.username,
          "receiver_with_talent" => user_1.talent.present?,
          "unread_messages_count" => chat_1.sender_unread_messages_count
        },
        {
          "id" => chat_3.id,
          "last_message_at" => chat_3.last_message_at.iso8601,
          "last_message_text" => chat_3.last_message_text,
          "receiver_id" => user_3.id,
          "receiver_last_online" => user_3.last_access_at&.iso8601,
          "receiver_messaging_disabled" => user_3.messaging_disabled,
          "receiver_profile_picture_url" => user_3.profile_picture_url,
          "receiver_ticker" => user_3.talent&.token&.ticker,
          "receiver_username" => user_3.username,
          "receiver_with_talent" => user_3.talent.present?,
          "unread_messages_count" => chat_3.sender_unread_messages_count
        }
      ]
    end

    context "when pagination is requested" do
      let(:params) do
        {
          page: 2,
          per_page: 1
        }
      end

      it "paginates the records" do
        get_chats

        expect(assigns(:chats)).to eq [
          {
            "id" => chat_1.id,
            "last_message_at" => chat_1.last_message_at.iso8601,
            "last_message_text" => chat_1.last_message_text,
            "receiver_id" => user_1.id,
            "receiver_last_online" => user_1.last_access_at&.iso8601,
            "receiver_messaging_disabled" => user_1.messaging_disabled,
            "receiver_profile_picture_url" => user_1.profile_picture_url,
            "receiver_ticker" => user_1.talent&.token&.ticker,
            "receiver_username" => user_1.username,
            "receiver_with_talent" => user_1.talent.present?,
            "unread_messages_count" => chat_1.sender_unread_messages_count
          }
        ]

        expect(assigns(:pagy).count).to eq 3
        expect(assigns(:pagy).page).to eq 2
        expect(assigns(:pagy).last).to eq 3
        expect(assigns(:pagy).vars[:items]).to eq "1"
      end
    end

    context "when a user is passed in the params" do
      let(:params) do
        {
          user: user_4.id
        }
      end
      let(:user_4) { create :user }
      let!(:chat_4) { create :chat, sender: current_user, receiver: user_4, last_message_at: 11.days.ago }

      it "returns a list of chats sorted by the last message at field with the user passed" do
        get_chats

        expect(assigns(:chats)).to eq [
          {
            "id" => chat_2.id,
            "last_message_at" => chat_2.last_message_at.iso8601,
            "last_message_text" => chat_2.last_message_text,
            "receiver_id" => user_2.id,
            "receiver_last_online" => user_2.last_access_at&.iso8601,
            "receiver_messaging_disabled" => user_2.messaging_disabled,
            "receiver_profile_picture_url" => user_2.profile_picture_url,
            "receiver_ticker" => user_2.talent&.token&.ticker,
            "receiver_username" => user_2.username,
            "receiver_with_talent" => user_2.talent.present?,
            "unread_messages_count" => chat_2.sender_unread_messages_count
          },
          {
            "id" => chat_1.id,
            "last_message_at" => chat_1.last_message_at.iso8601,
            "last_message_text" => chat_1.last_message_text,
            "receiver_id" => user_1.id,
            "receiver_last_online" => user_1.last_access_at&.iso8601,
            "receiver_messaging_disabled" => user_1.messaging_disabled,
            "receiver_profile_picture_url" => user_1.profile_picture_url,
            "receiver_ticker" => user_1.talent&.token&.ticker,
            "receiver_username" => user_1.username,
            "receiver_with_talent" => user_1.talent.present?,
            "unread_messages_count" => chat_1.sender_unread_messages_count
          },
          {
            "id" => chat_3.id,
            "last_message_at" => chat_3.last_message_at.iso8601,
            "last_message_text" => chat_3.last_message_text,
            "receiver_id" => user_3.id,
            "receiver_last_online" => user_3.last_access_at&.iso8601,
            "receiver_messaging_disabled" => user_3.messaging_disabled,
            "receiver_profile_picture_url" => user_3.profile_picture_url,
            "receiver_ticker" => user_3.talent&.token&.ticker,
            "receiver_username" => user_3.username,
            "receiver_with_talent" => user_3.talent.present?,
            "unread_messages_count" => chat_3.sender_unread_messages_count
          },
          {
            "id" => chat_4.id,
            "last_message_at" => chat_4.last_message_at.iso8601,
            "last_message_text" => chat_4.last_message_text,
            "receiver_id" => user_4.id,
            "receiver_last_online" => user_4.last_access_at&.iso8601,
            "receiver_messaging_disabled" => user_4.messaging_disabled,
            "receiver_profile_picture_url" => user_4.profile_picture_url,
            "receiver_ticker" => user_4.talent&.token&.ticker,
            "receiver_username" => user_4.username,
            "receiver_with_talent" => user_4.talent.present?,
            "unread_messages_count" => chat_4.sender_unread_messages_count
          }
        ]
      end
    end
  end
end
