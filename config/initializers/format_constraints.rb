module Routes
  class FormatConstraints
    attr_reader :formats

    def initialize(formats)
      # This coerces formats into an array
      @formats = Array(formats)
    end

    def matches?(request)
      # This checks to see the request format matches the array
      # Useful for multi formats like Routes::FormatConstraints.new([:html, :json])
      formats.include?(request.format.symbol)
    end
  end
end
