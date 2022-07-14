# frozen_string_literal: true

module Tasks
  class Verified < Task
    def title
      "Schedule an onboarding call and get your profile verified"
    end

    def description
      "Use the link below to schedule an onboarding call with someone from the Talent Protocol core team to be verified"
    end

    def link
      "https://talentprotocol.typeform.com/onboarding-call"
    end
  end
end
