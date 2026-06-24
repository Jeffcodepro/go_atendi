class FeaturesController < ApplicationController
  def index
    @features = Feature.active.ordered
    @lead = Lead.new(interest: "funcionalidades")
  end
end
