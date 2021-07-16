class User < ApplicationRecord
  include Clearance::User

  validate :role_is_valid, if: -> { role.present? }
  validate :external_id_or_email_and_password

  has_one :talent
  has_one :investor

  has_many :messagee, foreign_key: :receiver_id, class_name: "Message"
  has_many :senders, through: :messagee
  has_many :messaged, foreign_key: :sender_id, class_name: "Message"
  has_many :receivers, through: :messaged

  VALID_ROLES = ["admin"].freeze

  def admin?
    role == "admin"
  end

  def talent?
    talent.exists?
  end

  def investor?
    investor.exists?
  end

  def display_name
    username || email
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

  def external_id_or_email_and_password
    unless external_id.present? || (email.present? && encrypted_password.present?)
      errors.add(:base, "The user doesn't respect the required login requirements")
    end
  end
end
