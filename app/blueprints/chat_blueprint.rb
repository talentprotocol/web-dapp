class ChatBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :last_message_text

    field :last_message_at do |chat, _options|
      chat.last_message_at&.iso8601
    end

    field :unread_messages_count do |chat, options|
      chat.unread_messages_of(options[:current_user])
    end

    field :receiver_id do |chat, options|
      chat.receiver_of(options[:current_user]).id
    end

    field :receiver_username do |chat, options|
      chat.receiver_of(options[:current_user]).username
    end

    field :receiver_ticker do |chat, options|
      chat.receiver_of(options[:current_user]).talent&.token&.ticker
    end

    field :receiver_with_talent do |chat, options|
      chat.receiver_of(options[:current_user]).talent.present?
    end

    field :receiver_last_online do |chat, options|
      chat.receiver_of(options[:current_user]).last_access_at&.iso8601
    end

    field :receiver_profile_picture_url do |chat, options|
      chat.receiver_of(options[:current_user]).profile_picture_url
    end

    field :receiver_messaging_disabled do |chat, options|
      chat.receiver_of(options[:current_user]).messaging_disabled
    end
  end
end
