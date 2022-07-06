# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def send_sign_up_email
    UserMailer.with(user_id: User.first.id).send_sign_up_email
  end

  def send_password_reset_email
    UserMailer.with(user: User.first).send_password_reset_email
  end

  def send_token_launched_email
    UserMailer.with(user: User.first).send_token_launched_email
  end

  def send_message_received_email
    recipient = User.first
    sender_id = User.second.id
    notification = Notification.create(
      type: "MessageReceivedNotification",
      params: {
        "sender_id" => sender_id,
      },
      recipient: recipient
    )
    UserMailer.with(recipient: recipient, record: notification, sender_id: sender_id).send_message_received_email
  end
end
