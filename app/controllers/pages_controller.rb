class PagesController < ApplicationController
  def home
    @solutions = Solution.active.ordered.limit(3)
    @features = Feature.active.ordered.limit(6)
    @results = ProductResult.active.ordered.limit(4)
    @plans = Plan.active.ordered.limit(3)
    @testimonials = Testimonial.active.ordered.limit(3)
    @faqs = Faq.active.ordered.limit(5)
    @lead = Lead.new(interest: "demo")
  end

  def privacidade
  end

  def termos
  end

  def cookies_policy
  end

  def lgpd
  end

  def data_deletion
  end
end
