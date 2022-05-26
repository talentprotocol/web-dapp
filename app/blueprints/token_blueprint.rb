class TokenBlueprint < Blueprinter::Base
  fields :id, :contract_id, :ticker, :deployed_at

  view :normal do
    fields :deployed
  end
end
