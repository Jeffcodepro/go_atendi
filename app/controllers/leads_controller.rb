class LeadsController < ApplicationController
  def new
    @lead = Lead.new(interest: params[:interest].presence || "inscricao")
    @plans = Plan.active.ordered
  end

  def create
    @lead = Lead.new(lead_params)
    @lead.source = params[:source].presence || @lead.source.presence || "website"

    if @lead.save
      redirect_to inscricao_path, notice: "Recebemos seu interesse no GO ATendi. Em breve entraremos em contato."
    else
      @plans = Plan.active.ordered
      render :new, status: :unprocessable_entity
    end
  end

  private

  def lead_params
    params.require(:lead).permit(
      :name,
      :email,
      :phone,
      :company_name,
      :company_size,
      :interest,
      :message,
      :source,
      :accepted_terms
    )
  end
end
