class TokenBlueprint < Blueprinter::Base
  fields :id, :contract_id, :ticker

  view :normal do
    fields :deployed
  end
end
