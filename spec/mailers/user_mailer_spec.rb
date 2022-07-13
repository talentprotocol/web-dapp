require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  let(:user) { create :user }

  describe "Sign Up Email" do
    let(:mail) { described_class.with(user_id: user.id).send_sign_up_email }

    it "renders the header" do
      expect(mail.subject).to eql("Welcome to Talent Protocol")
      expect(mail.to).to eql([user.email])
    end

    it "assigns email verify url" do
      expect { confirm_email_url(token: user.email_confirmation_token) }.not_to raise_error
    end
  end

  describe "Password reset email" do
    let(:mail) { described_class.with(user: user).send_password_reset_email }

    it "renders the header" do
      expect(mail.subject).to eql("Talent Protocol - Did you forget your password?")
      expect(mail.to).to eql([user.email])
    end

    it "assigns reset password url" do
      expect { url_for([user, :password, action: :edit, token: user.confirmation_token]) }.not_to raise_error
    end
  end

  describe "Welcome email" do
    let(:mail) { described_class.with(user: user).send_welcome_email }

    context "user is talent" do
      let(:user) { create :user, :with_talent }

      it "renders the header" do
        expect(mail.subject).to eql("Invite to launch your token on Talent Protocol 🔑")
        expect(mail.to).to eql([user.email])
      end
    end

    context "user is supporter" do
      let(:user) { create :user, :with_investor }

      it "renders the header" do
        expect(mail.subject).to eql("Personal invite for Talent Protocol Beta 🔑")
        expect(mail.to).to eql([user.email])
      end
    end

    it "assigns username" do
      expect(mail.body.encoded).to match(user.username)
    end
  end

  describe "token launch email" do
    let(:mail) { described_class.with(user: user).send_token_launched_email }

    it "renders the header" do
      expect(mail.subject).to eql("Congrats, your Talent Token is now live!")
      expect(mail.to).to eql([user.email])
    end

    it "assigns profile url" do
      expect { talent_profile_url(user.username) }.not_to raise_error
    end
  end
end
