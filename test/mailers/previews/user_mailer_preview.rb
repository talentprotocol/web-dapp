# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def send_sign_up_email
    UserMailer.with(user: User.first).send_sign_up_email
  end
end
