class Plan < ApplicationRecord
  before_validation :set_slug, if: -> { slug.blank? && name.present? }

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :price_cents, numericality: { greater_than_or_equal_to: 0 }
  validates :billing_period, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:position, :price_cents, :name) }
  scope :highlighted, -> { where(highlighted: true) }

  def formatted_price
    return "Sob consulta" if price_cents.zero?

    price = price_cents / 100.0
    "R$ #{format('%.2f', price).tr('.', ',')}"
  end

  private

  def set_slug
    self.slug = name.parameterize
  end
end
