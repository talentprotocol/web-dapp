require "rails_helper"

RSpec.feature "Messages", type: :feature do
  describe "/messages" do
    it "returns Anne as a possible messagee for Bob" do
      bob = create(:user, username: "Bob", email: "bob@talentprotocol.com")
      anne = create(:user, username: "Anne", email: "anne@talentprotocol.com")

      visit messages_path(as: bob)

      expect(page).to have_content(anne.username)
    end
  end
end
