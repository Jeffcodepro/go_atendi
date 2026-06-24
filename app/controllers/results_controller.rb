class ResultsController < ApplicationController
  def index
    @results = ProductResult.active.ordered
    @testimonials = Testimonial.active.ordered
    @lead = Lead.new(interest: "resultados")
  end
end
