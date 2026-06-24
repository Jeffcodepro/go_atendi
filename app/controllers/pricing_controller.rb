class PricingController < ApplicationController
  def index
    @plans = Plan.active.ordered
    @faqs = Faq.active.ordered
    @lead = Lead.new(interest: "preco")
  end
end
