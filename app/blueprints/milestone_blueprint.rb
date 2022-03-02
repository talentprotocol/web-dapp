class MilestoneBlueprint < Blueprinter::Base
  fields :id, :title, :description

  view :normal do
    fields :start_date, :end_date, :link, :institution
  end
end
