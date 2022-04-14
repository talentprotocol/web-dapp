class User < ApplicationRecord
  include Clearance::User

  validate :role_is_valid, if: -> { role.present? }
  validate :email_and_password
  validate :validate_notification_preferences
  validate :username_is_valid

  has_one :talent
  has_one :investor
  has_many :invites
  belongs_to :invited, class_name: "Invite", foreign_key: "invite_id", optional: true
  belongs_to :race, optional: true
  has_many :user_tags
  has_many :tags, through: :user_tags

  # Chat
  has_many :messagee, foreign_key: :receiver_id, class_name: "Message"
  has_many :senders, through: :messagee
  has_many :messaged, foreign_key: :sender_id, class_name: "Message"
  has_many :receivers, through: :messaged

  # Feed
  has_one :feed
  has_many :follows
  has_many :followers, through: :follows # only use to load users, never to count
  has_many :following, foreign_key: :follower_id, class_name: "Follow"
  has_many :comments
  has_many :posts
  has_many :notifications, as: :recipient
  has_many :quests

  # Rewards
  has_many :rewards

  VALID_ROLES = ["admin", "basic"].freeze

  module Delivery
    TYPES = [
      MessageReceivedNotification,
      TokenAcquiredNotification
    ].map(&:name).freeze

    METHODS = [DISABLED = 0, IMMEDIATE = 1, DIGEST = 2]
  end

  # [CLEARANCE] override email writing to allow nil but not two emails ""
  def self.normalize_email(email)
    if email.nil?
      email
    else
      email.to_s.downcase.gsub(/\s+/, "")
    end
  end
  # [CLEARANCE] end

  def admin?
    role == "admin"
  end

  def talent?
    talent.present?
  end

  def investor?
    investor.present?
  end

  def display_wallet_id
    wallet_id ? "#{wallet_id[0..10]}..." : ""
  end

  def sender_chat_id(chat_user)
    [id, chat_user.id].join("")
  end

  def receiver_chat_id(chat_user)
    [id, chat_user.id].join("")
  end

  def last_message_with(chat_user)
    result = Message.where(sender_id: id, receiver_id: chat_user.id)
      .or(Message.where(sender_id: chat_user.id, receiver_id: id)).order(id: :desc).limit(1)

    if result.length > 0
      result[0]
    end
  end

  def confirm_email
    self.email_confirmed_at = Time.current
    save
  end

  def active_theme
    if theme_preference == "light"
      "light-body"
    else
      "dark-body"
    end
  end

  def has_unread_messages?
    messagee.unread.any?
  end

  def self.valid_username?(new_username)
    new_username && new_username.length > 0 && new_username.match?(/^[a-z0-9]*$/)
  end

  def self.valid_email?(new_email)
    new_email && new_email.length > 0 && new_email.match?(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  end

  def as_json(options = {})
    options[:except] ||= [:remember_token, :encrypted_password, :confirmation_token, :last_sign_in_at, :nounce, :email_confirmation_token]
    super(options)
  end

  def prefers_digest_notification?(type)
    notification_preferences[type.name] == Delivery::DIGEST
  end

  def prefers_immediate_notification?(type)
    notification_preferences[type.name].nil? ||
      notification_preferences[type.name] == Delivery::IMMEDIATE
  end

  def supporters(including_self: true)
    return User.none unless talent&.token

    supporters_wallet_ids = TalentSupporter.where(talent_contract_id: talent.token.contract_id).pluck(:supporter_wallet_id)
    supporters = User.where(wallet_id: supporters_wallet_ids)

    including_self ? supporters : supporters.where.not(id: id)
  end

  private

  def validate_notification_preferences
    valid = false

    if notification_preferences.is_a?(Hash)
      valid = notification_preferences.all? do |type, value|
        Delivery::TYPES.include?(type) && Delivery::METHODS.include?(value)
      end
    end

    if !valid
      errors.add(:notification_preferences, "Invalid notification preferences.")
    end
  end

  def role_is_valid
    unless role.in?(VALID_ROLES)
      errors.add(:base, "The role #{role} isn't supported.")
    end
  end

  def username_is_valid
    unless username.match?(/^[a-z0-9]*$/)
      errors.add(:base, "The username has invalid characters.")
    end
  end

  def email_optional?
    true
  end

  def password_optional?
    true
  end

  def email_and_password
    return if email.present? && encrypted_password.present?

    errors.add(:base, "The user doesn't respect the required login requirements")
  end
end
