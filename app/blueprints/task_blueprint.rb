class TaskBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :title, :description, :reward, :status, :link
    field :userId do |task, _options|
      task.quest.user_id
    end
  end
end
