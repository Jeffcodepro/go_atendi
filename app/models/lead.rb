class Lead < ApplicationRecord
  enum :status, {
    new_lead: 0,
    contacted: 1,
    qualified: 2,
    converted: 3,
    discarded: 4
  }

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true
  validates :interest, presence: true
  validates :accepted_terms, acceptance: true

  before_validation :normalize_email
  before_validation :set_default_source

  scope :recent, -> { order(created_at: :desc) }

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end

  def set_default_source
    self.source = "website" if source.blank?
  end
end
