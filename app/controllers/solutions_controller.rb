class SolutionsController < ApplicationController
  def index
    @solutions = Solution.active.ordered
    @lead = Lead.new(interest: "solucoes")
  end
end
