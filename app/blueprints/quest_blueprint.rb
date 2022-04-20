class QuestBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :title, :subtitle, :description, :status
    association :user, blueprint: UserBlueprint, view: :normal
    association :tasks, blueprint: TaskBlueprint, view: :normal
  end
end
