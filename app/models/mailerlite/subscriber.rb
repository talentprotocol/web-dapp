class Mailerlite::Subscriber
  attr_accessor :id, :name, :email

  def initialize(params)
    @id = params.fetch(:id, nil)
    @name = params.fetch(:name, nil)
    @email = params.fetch(:email, nil)
  end
end
