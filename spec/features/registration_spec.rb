require "rails_helper"

RSpec.feature "Registration", type: :feature do
  xdescribe "/" do
    it "returns the registation screen", :js do
      visit root_path

      expect(page).to have_content("We're currently in secret alpha. Enter your email to validate you have access to the platform or request access.")
    end

    it "returns the Feeds page if the user is logged_in", :js do
      bob = create(:user)
      create(:feed, user: bob)

      visit root_path(as: bob)

      expect(page.find("h1").text).to eq("Home")
    end

    context "Checking the wait list", :js do
      it "allows me to validate if i'm on the wait list" do
        visit root_path

        fill_in("Email", with: "bob@talentprotocol.com")
        click_button("Request Access")

        # Request is happening
        expect(page.find("#wait-list-success")).to have_content("You're on the wait list!")

        # Validate that the wait list was populated
        expect(WaitList.find_by(email: "bob@talentprotocol.com")).to be_present
      end

      it "allows me to validate if i'm on the wait list" do
        visit root_path

        fill_in("Email", with: "bob@talentprotocol.com")
        click_button("Request Access")

        # Request is happening
        expect(page.find("#wait-list-success")).to have_content("You're on the wait list!")

        # Validate that the wait list was populated
        expect(WaitList.find_by(email: "bob@talentprotocol.com")).to be_present
      end

      it "checks if the email is already in the wait list or not" do
        create(:wait_list, email: "bob@talentprotocol.com")

        visit root_path

        fill_in("Email", with: "bob@talentprotocol.com")
        click_button("Request Access")

        # Request is happening
        expect(page.find("#wait-list-error")).to have_content("You're already on it! The email already exists in the wait list.")

        # Validate that the wait list was populated
        expect(WaitList.find_by(email: "bob@talentprotocol.com")).to be_present
      end
    end

    context "After wait list", :js do
      it "if approved it allows me to move to the next step" do
        create(:wait_list, email: "bob@talentprotocol.com", approved: true)

        visit root_path

        fill_in("Email", with: "bob@talentprotocol.com")
        click_button("Validate")

        expect(page.find("#email-validation-approved")).to have_content("You're in the guest list!")

        click_button("Next >")

        expect(page.find("h1")).to have_content("Username")
      end

      it "if not approved it shows as unapproved" do
        create(:wait_list, email: "bob@talentprotocol.com", approved: false)

        visit root_path

        fill_in("Email", with: "bob@talentprotocol.com")
        click_button("Validate")

        expect(page.find("#email-validation-unapproved")).to have_content("You're not approved to join the platform yet.. reach out to us on why you should join right now!")
      end

      it "if no wait list exists it shows me an error" do
        visit root_path

        fill_in("Email", with: "bob@talentprotocol.com")
        click_button("Validate")

        expect(page.find("#email-validation-error")).to have_content("You aren't on it yet.. please request access.")
      end
    end
  end
end
