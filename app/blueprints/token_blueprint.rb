class TokenBlueprint < Blueprinter::Base
  fields :id, :contract_id, :ticker, :chain_id

  view :normal do
    fields :deployed
  end
end
