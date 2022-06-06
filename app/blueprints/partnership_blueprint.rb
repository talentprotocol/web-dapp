class PartnershipBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :logo_url, :website_url, :twitter_url
  end
end
