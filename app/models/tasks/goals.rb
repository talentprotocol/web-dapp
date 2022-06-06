# frozen_string_literal: true

module Tasks
    class Goals < Task
        def title
            "Goals"
        end
        
        def link
            "/u/#{quest.user.username}/edit_profile?tab=Goal"
        end
    end
end
