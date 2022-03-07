module MetaTagsHelper
  def meta_title
    content_for?(:meta_title) ? content_for(:meta_title) : DEFAULT_META["meta_title"]
  end

  def meta_description
    content_for?(:meta_description) ? content_for(:meta_description) : DEFAULT_META["meta_description"]
  end

  def meta_image
    content_for?(:meta_image) ? content_for(:meta_image) : DEFAULT_META["meta_image"]
  end

  def meta_card_type
    content_for?(:meta_card_type) ? content_for(:meta_card_type) : DEFAULT_META["meta_card_type"]
  end
end
