module Invites
  class CreatePartnership
    class Error < StandardError; end

    class CreationError < Error; end

    class InviteAlreadyExistsError < Error; end

    def initialize(user:, invite_code:, max_uses:, partnership_params:)
      @user = user
      @invite_code = invite_code
      @max_uses = max_uses
      @partnership_params = partnership_params
    end

    def call
      invite = user.invites.find_by(talent_invite: true)

      raise InviteAlreadyExistsError.new("Talent invite already created for the user.") if invite

      invite = Invite.create(
        user: user,
        talent_invite: true,
        max_uses: max_uses,
        code: invite_code
      )

      raise CreationError.new("Unable to create invite. Errors: #{invite.errors.full_messages.join(", ")}") if invite.errors.any?

      partnership = Partnership.create(
        partnership_params.merge(invite: invite)
      )

      raise CreationError.new("Unable to create partnership. Errors: #{partnership.errors.full_messages.join(", ")}") if partnership.errors.any?

      partnership
    end

    private

    attr_reader :user, :invite_code, :max_uses, :partnership_params
  end
end
