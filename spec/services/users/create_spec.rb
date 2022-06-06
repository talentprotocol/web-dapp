require "rails_helper"

RSpec.describe Users::Create do
  include ActiveJob::TestHelper

  subject(:create_user) { described_class.new.call(user_creation_params) }

  let(:user_creation_params) {
    {
      email: email,
      username: username,
      password: password,
      invite_code: invite_code,
      theme_preference: theme_preference
    }
  }

  let(:email) { "test@talentprotocol.com" }
  let(:username) { "test" }
  let(:password) { "password" }
  let(:invite_code) { invite.code }
  let(:theme_preference) { "light" }

  let(:user) { create :user, username: "jack" }
  let!(:invite) { create :invite, user: user }

  context "when a valid invite is provided" do
    it "it creates a new user" do
      result = create_user

      expect(result[:success]).to be(true)
      expect(result[:user]).to be_persisted
    end
  end

  context "when the invite already has enough uses for the scout reward" do
    let(:invite) { create(:invite, user: user, talent_invite: true, uses: 4) }

    it "it enqueues the job to calculate rewards" do
      Sidekiq::Testing.inline! do
        create_user

        expect(enqueued_jobs.size).to eq 1
        job = enqueued_jobs[0]
        expect(job["arguments"][0]["type"]).to eq("Tasks::Register")
        expect(job["arguments"][0]["user_id"]).to eq(user.id)
      end
    end
  end

  context "when it is a talent invite" do
    let(:invite) { create(:invite, user: user, talent_invite: true) }

    it "creates a new user with talent as profile type" do
      create_user

      user = User.find_by(email: email)

      expect(user.profile_type).to eq("talent")
    end

    context "when the talent invite passed is associated with a partnership" do
      let!(:invite) { create :invite, partnership: partnership, user: create(:user), code: "core-team", talent_invite: true }
      let!(:partnership) { create :partnership, name: "Talent Protocol Core Team", description: "Team building Talent Protocol." }

      it "creates a new discovery row" do
        create_user

        created_discovery_row = DiscoveryRow.last

        aggregate_failures do
          expect(created_discovery_row.partnership).to eq partnership
          expect(created_discovery_row.title).to eq partnership.name
          expect(created_discovery_row.description).to eq partnership.description
        end
      end

      it "creates the discovery row with the correct arguments" do
        expect { create_user }.to change(DiscoveryRow, :count).from(0).to(1)
      end

      it "creates a new hidden tag" do
        expect { create_user }.to change(Tag.where(hidden: true), :count).from(0).to(1)
      end

      it "creates the tag the correct arguments" do
        create_user

        created_tag = Tag.last

        aggregate_failures do
          expect(created_tag.description).to eq invite_code
          expect(created_tag.hidden).to eq true
        end
      end

      it "associates the new tag with the user and the discovery row" do
        create_user

        created_user = User.last
        created_discovery_row = DiscoveryRow.last
        created_tag = Tag.last

        aggregate_failures do
          expect(created_user.tags).to include created_tag
          expect(created_discovery_row.tags).to include created_tag
        end
      end

      context "when the discovery row already exists" do
        let!(:discovery_row) { create :discovery_row, partnership: partnership }

        it "does not create a new discovery row" do
          expect { create_user }.not_to change(DiscoveryRow, :count)
        end

        it "associates the new tag with existing discovery row" do
          create_user

          created_tag = Tag.last

          expect(discovery_row.tags).to include created_tag
        end
      end

      context "when the hidden tag already exists" do
        let!(:tag) { create :tag, description: invite_code, hidden: true }

        it "does not create a new tag" do
          expect { create_user }.not_to change(Tag.where(hidden: true), :count)
        end

        it "associates the existing tag with the user and the discovery row" do
          create_user

          created_user = User.last
          created_discovery_row = DiscoveryRow.last

          aggregate_failures do
            expect(created_user.tags).to include tag
            expect(created_discovery_row.tags).to include tag
          end
        end
      end
    end
  end
end
