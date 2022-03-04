class BaseNotification < Noticed::Base
  deliver_by :database
  deliver_by :email, mailer: "NotificationMailer", method: :immediate,
                     delay: 15.minutes, if: :should_deliver_immediate_email?

  def body
    t(".body", name: source_name)
  end

  def button_label
    t(".button")
  end

  def emailed?
    record.emailed_at.present?
  end

  def source
    @source ||=
      User.find_by(id: params.params["source_id"])
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

  def should_deliver_immediate_email?
    unread? && !emailed? &&
      recipient.prefers_immediate_notification?(self.class)
  end

  def should_deliver_digest_email?
    unread? && !emailed? &&
      recipient.prefers_digest_notification?(self.class)
  end

  def title
    t(".title")
  end

  def url
    raise "This method should be redefined on the subclass"
  end
end
