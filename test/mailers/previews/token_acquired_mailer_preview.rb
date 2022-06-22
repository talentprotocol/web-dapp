# Preview all emails at http://localhost:3000/rails/mailers/token_acquired_mailer
class TokenAcquiredMailerPreview < ActionMailer::Preview
  def new_supporter
    staking_user = User.first
    recipient = User.second

    record = Notification.create(
      type: "TokenAcquiredNotification",
      params: {
        "reinvestment" => false,
        "source_id" => staking_user.id
      },
      recipient: recipient
    )

    TokenAcquiredMailer.with(recipient: User.second, record: record, source_id: staking_user.id).new_supporter
  end
end
