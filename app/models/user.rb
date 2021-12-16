class User < ApplicationRecord
  include Clearance::User

  validate :role_is_valid, if: -> { role.present? }
  validate :email_and_password

  has_one :talent
  has_one :investor
  has_one :invite
  belongs_to :invited, class_name: "Invite", foreign_key: "invite_id", optional: true

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
  has_many :testimonials
  has_many :notifications
  has_many :notification_sources, foreign_key: :source_id, class_name: "Notification"

  VALID_ROLES = ["admin"].freeze

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

  def has_unread_messages?
    messagee.unread.any?
  end

  private

  def role_is_valid
    unless role.in?(VALID_ROLES)
      errors.add(:base, "The role #{role} isn't supported.")
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
