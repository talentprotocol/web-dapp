# Preview all emails at http://localhost:3000/rails/mailers/token_acquired_mailer
class TokenAcquiredMailerPreview < ActionMailer::Preview
  def new_supporter
    record = Notification.create(
      type: "TokenAcquiredNotification",
      params: {
        "reinvestment" => false,
        "source_id" => staking_user.id
      },
      recipient: recipient
    )

    TokenAcquiredMailer.with(recipient: recipient, record: record, source_id: staking_user.id).new_supporter
  end

  def existing_supporter
    record = Notification.create(
      type: "TokenAcquiredNotification",
      params: {
        "reinvestment" => true,
        "source_id" => staking_user.id
      },
      recipient: recipient
    )

    TokenAcquiredMailer.with(recipient: recipient, record: record, source_id: staking_user.id).existing_supporter
  end

  private

  def staking_user
    User.first
  end

  def recipient
    User.second
  end
end
