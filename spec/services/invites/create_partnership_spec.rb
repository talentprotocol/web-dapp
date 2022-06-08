require "rails_helper"

RSpec.describe Invites::CreatePartnership do
  subject(:create_partnership) do
    described_class.new(
      invite_code: invite_code,
      max_uses: max_uses,
      user: user,
      partnership_params: partnership_params
    ).call
  end

  let(:user) { create :user }
  let(:invite_code) { "talent-protocol" }
  let(:max_uses) { 10 }
  let(:partnership_params) do
    {
      name: "Talent Protocol Core Team",
      description: "Team building Talent Protocol.",
      website_url: "https://www.talentprotocol.com",
      twitter_url: "https://twitter.com/talentprotocol"
    }
  end

  it "creates one invite" do
    expect { create_partnership }.to change(Invite, :count).from(0).to(1)
  end

  it "creates a partnership" do
    expect { create_partnership }.to change(Partnership, :count).from(0).to(1)
  end

  it "creates the invite with the correct params" do
    create_partnership

    invite = Invite.last

    aggregate_failures do
      expect(invite.max_uses).to eq max_uses
      expect(invite.talent_invite).to eq true
      expect(invite.code).to eq invite_code
      expect(invite.user).to eq user
    end
  end

  it "creates the partnership with the correct params" do
    create_partnership

    invite = Invite.last
    partnership = Partnership.last

    aggregate_failures do
      expect(partnership.invite).to eq invite
      expect(partnership.name).to eq "Talent Protocol Core Team"
      expect(partnership.description).to eq "Team building Talent Protocol."
      expect(partnership.website_url).to eq "https://www.talentprotocol.com"
      expect(partnership.twitter_url).to eq "https://twitter.com/talentprotocol"
    end
  end

  context "when the user already has a talent invite" do
    let!(:invite) { create :invite, user: user, talent_invite: true, code: "talent-protocol-1" }

    it "raises an error" do
      expect { create_partnership }.to raise_error(
        described_class::InviteAlreadyExistsError,
        "Talent invite already created for the user."
      )
    end
  end

  context "when the invite code is nil" do
    let(:invite_code) { nil }

    it "raises an error" do
      expect { create_partnership }.to raise_error(
        described_class::CreationError,
        "Unable to create invite. Errors: Code can't be blank"
      )
    end
  end

  context "when the partnership params are not valid" do
    let(:partnership_params) do
      {
        name: nil
      }
    end

    it "raises an error" do
      expect { create_partnership }.to raise_error(
        described_class::CreationError,
        "Unable to create partnership. Errors: Name can't be blank"
      )
    end
  end
end
