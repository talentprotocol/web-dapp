class MarketingArticleBlueprint < Blueprinter::Base
  fields :id, :link, :title

  view :normal do
    fields :description, :image_url
  end
end
