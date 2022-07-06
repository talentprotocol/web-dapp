# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def send_sign_up_email
    UserMailer.with(user_id: User.first.id).send_sign_up_email
  end

  def send_welcome_email_talent
    UserMailer.with(user: Talent.first.user).send_welcome_email
  end

  def send_welcome_email_investor
    UserMailer.with(user: Investor.first.user).send_welcome_email
  end

  def send_token_launch_reminder_email
    UserMailer.with(user: User.first).send_token_launch_reminder_email
  end

  def send_token_purchase_reminder_email
    UserMailer.with(user: User.first).send_token_purchase_reminder_email
  end

  def send_talent_upgrade_email
    UserMailer.with(user: User.first).send_talent_upgrade_email
  end
end
