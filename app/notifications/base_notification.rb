class BaseNotification < Noticed::Base
  deliver_by :database

  def body
    t(".body", name: source_name)
  end

  def source
    if @source_loaded
      @source
    else
      @source_loaded = true
      @source = User.find_by(id: params["source_id"])
    end
  end

  def source_name
    @source_name ||=
      if source.nil?
        "Anonymous"
      elsif source.display_name.present?
        source.display_name
      else
        source.username
      end
  end

  def title
    t(".title")
  end

  def url
    raise "This method should be redefined on the subclass"
  end
end
